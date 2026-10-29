(function (global) {
  "use strict";

  const SESSION_KEY = "dts-cloudflare-session-v1";
  let session = null;
  try { session = JSON.parse(global.localStorage.getItem(SESSION_KEY) || "null"); } catch (_) {}

  const saveSession = (value) => {
    session = value || null;
    try {
      if (session) global.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else global.localStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  };

  async function request(path, init = {}) {
    const headers = new Headers(init.headers || {});
    headers.set("accept", "application/json");
    if (init.body) headers.set("content-type", "application/json");
    if (session?.access_token) headers.set("authorization", `Bearer ${session.access_token}`);
    try {
      const response = await fetch(path, { ...init, headers });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { data: null, error: { message: body.error || `Request failed (${response.status}).`, code: body.code || String(response.status) }, count: null };
      }
      return { data: body.data ?? body, error: null, count: body.count ?? null };
    } catch (error) {
      return { data: null, error: { message: error.message || String(error), code: "NETWORK_ERROR" }, count: null };
    }
  }

  class QueryBuilder {
    constructor(table) {
      this.table = table;
      this.operation = "select";
      this.values = null;
      this.filters = [];
      this.orderBy = null;
      this.maxRows = null;
      this.options = {};
      this.returning = false;
      this.cardinality = "many";
      this.columns = "*";
    }
    select(columns = "*", options = {}) {
      this.columns = columns;
      this.options = { ...this.options, ...options };
      if (this.operation !== "select") this.returning = true;
      return this;
    }
    insert(values) { this.operation = "insert"; this.values = values; return this; }
    upsert(values, options = {}) { this.operation = "upsert"; this.values = values; this.options = { ...this.options, ...options }; return this; }
    update(values) { this.operation = "update"; this.values = values; return this; }
    delete() { this.operation = "delete"; return this; }
    eq(column, value) { this.filters.push({ type: "eq", column, value }); return this; }
    in(column, values) { this.filters.push({ type: "in", column, values: Array.isArray(values) ? values : [] }); return this; }
    order(column, options = {}) { this.orderBy = { column, ascending: options.ascending !== false }; return this; }
    limit(value) { this.maxRows = Math.max(0, Number(value) || 0); return this; }
    maybeSingle() { this.cardinality = "maybeSingle"; return this; }
    single() { this.cardinality = "single"; return this; }
    async execute() {
      return request("/api/data", {
        method: "POST",
        body: JSON.stringify({
          table: this.table,
          operation: this.operation,
          values: this.values,
          filters: this.filters,
          order: this.orderBy,
          limit: this.maxRows,
          options: this.options,
          returning: this.returning,
          cardinality: this.cardinality,
          columns: this.columns,
        }),
      });
    }
    then(resolve, reject) { return this.execute().then(resolve, reject); }
  }

  class PollingChannel {
    constructor(client, name, options) {
      this.client = client;
      this.name = name;
      this.options = options || {};
      this.handlers = [];
      this.timer = null;
      this.snapshots = new Map();
      this.presenceHandlers = [];
    }
    on(kind, filter, callback) {
      if (kind === "postgres_changes") this.handlers.push({ filter, callback });
      if (kind === "presence") this.presenceHandlers.push(callback);
      return this;
    }
    subscribe(callback) {
      callback?.("SUBSCRIBED");
      this.presenceHandlers.forEach((handler) => handler());
      this.poll();
      this.timer = global.setInterval(() => this.poll(), 4000);
      return this;
    }
    track() { this.presenceHandlers.forEach((handler) => handler()); return Promise.resolve("ok"); }
    presenceState() {
      const key = this.options?.config?.presence?.key || "viewer";
      return { [key]: [{}] };
    }
    async poll() {
      for (const registration of this.handlers) {
        let query = this.client.from(registration.filter.table).select("*");
        const raw = String(registration.filter.filter || "");
        const match = raw.match(/^([^=]+)=eq\.(.*)$/);
        if (match) query = query.eq(match[1], match[2]);
        const result = await query;
        if (result.error) continue;
        const key = JSON.stringify(registration.filter);
        const previous = this.snapshots.get(key) || new Map();
        const next = new Map((result.data || []).map((row) => [String(row.id || JSON.stringify(row)), JSON.stringify(row)]));
        for (const row of result.data || []) {
          const id = String(row.id || JSON.stringify(row));
          if (previous.get(id) !== JSON.stringify(row)) {
            registration.callback({ eventType: previous.has(id) ? "UPDATE" : "INSERT", new: row, old: previous.has(id) ? JSON.parse(previous.get(id)) : {} });
          }
        }
        for (const [id, oldRow] of previous) {
          if (!next.has(id)) registration.callback({ eventType: "DELETE", new: {}, old: JSON.parse(oldRow) });
        }
        this.snapshots.set(key, next);
      }
    }
    unsubscribe() { if (this.timer) global.clearInterval(this.timer); this.timer = null; }
  }

  function createClient() {
    const client = {
      auth: {
        async signInWithPassword(credentials) {
          const result = await request("/api/auth/sign-in", { method: "POST", body: JSON.stringify(credentials) });
          if (!result.error && result.data?.session) saveSession(result.data.session);
          return result.error ? result : { data: { user: result.data.user, session: result.data.session }, error: null };
        },
        async signUpWithCourse(credentials) {
          const result = await request("/api/auth/sign-up-course", { method: "POST", body: JSON.stringify(credentials) });
          if (!result.error && result.data?.session) saveSession(result.data.session);
          return result.error ? result : { data: { user: result.data.user, session: result.data.session }, error: null };
        },
        async getSession() {
          if (!session?.access_token) return { data: { session: null }, error: null };
          const result = await request("/api/auth/session");
          if (result.error || !result.data?.session) { saveSession(null); return { data: { session: null }, error: result.error }; }
          saveSession(result.data.session);
          return { data: { session: result.data.session }, error: null };
        },
        async signOut() {
          const result = await request("/api/auth/sign-out", { method: "POST" });
          saveSession(null);
          return result;
        },
      },
      from(table) { return new QueryBuilder(table); },
      rpc(name, params = {}) { return request(`/api/rpc/${encodeURIComponent(name)}`, { method: "POST", body: JSON.stringify(params) }); },
      functions: { invoke(name, options = {}) { return request(`/api/functions/${encodeURIComponent(name)}`, { method: "POST", body: JSON.stringify(options.body || {}) }); } },
      channel(name, options) { return new PollingChannel(client, name, options); },
      removeChannel(channel) { channel?.unsubscribe?.(); return Promise.resolve("ok"); },
    };
    return client;
  }

  global.CloudflareDataClient = { createClient };
})(window);
