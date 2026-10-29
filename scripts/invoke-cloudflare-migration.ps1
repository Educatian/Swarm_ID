param([switch]$Execute,[switch]$BackupConfirmed,[string]$TargetOrigin='https://dts-ko-preview.pages.dev')
$ErrorActionPreference='Stop'
Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices; using System.Text;
public static class DtsCredentialReader {
 [StructLayout(LayoutKind.Sequential,CharSet=CharSet.Unicode)] private struct C { public uint Flags; public uint Type; public string TargetName; public string Comment; public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten; public uint BlobSize; public IntPtr Blob; public uint Persist; public uint AttributeCount; public IntPtr Attributes; public string TargetAlias; public string UserName; }
 [DllImport("advapi32.dll",EntryPoint="CredReadW",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool Read(string t,uint ty,uint f,out IntPtr p); [DllImport("advapi32.dll")] static extern void CredFree(IntPtr p);
 public static string Get(string t){IntPtr p;if(!Read(t,1,0,out p))throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());try{var c=(C)Marshal.PtrToStructure(p,typeof(C));var b=new byte[c.BlobSize];Marshal.Copy(c.Blob,b,0,b.Length);return Encoding.UTF8.GetString(b).Trim();}finally{CredFree(p);}}
}
'@
$env:SUPABASE_ACCESS_TOKEN=[DtsCredentialReader]::Get('Supabase CLI:supabase')
$env:CLOUDFLARE_MIGRATION_ORIGIN=$TargetOrigin.TrimEnd('/')
if($Execute){$env:MIGRATION_SECRET=[DtsCredentialReader]::Get('Design Tension Cloudflare Migration')}
$migrationArgs=@('scripts/migrate-supabase-to-cloudflare.mjs'); if($Execute){$migrationArgs+='--execute'}; if($BackupConfirmed){$migrationArgs+='--backup-confirmed'}
try { & node @migrationArgs; exit $LASTEXITCODE } finally { Remove-Item Env:SUPABASE_ACCESS_TOKEN -ErrorAction SilentlyContinue; Remove-Item Env:MIGRATION_SECRET -ErrorAction SilentlyContinue }
