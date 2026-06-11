"""Mux ElevenLabs narration onto the recorded guide clips (webm -> mp4 h264+aac).
Usage: py scripts/mux-guide-videos.py
"""
import pathlib, subprocess
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
ROOT = pathlib.Path(__file__).resolve().parent.parent

def mux(group):
    vdir = ROOT / "guides" / "videos" / group
    adir = ROOT / "guides" / "audio" / group
    for webm in sorted(vdir.glob("*.webm")):
        mp3 = adir / (webm.stem + ".mp3")
        out = vdir / (webm.stem + ".mp4")
        cmd = [FF, "-y", "-i", str(webm)]
        if mp3.exists():
            cmd += ["-i", str(mp3), "-map", "0:v:0", "-map", "1:a:0"]
        cmd += [
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        ]
        if mp3.exists():
            cmd += ["-c:a", "aac", "-b:a", "128k", "-shortest"]
        cmd += [str(out)]
        subprocess.run(cmd, check=True, capture_output=True)
        size = out.stat().st_size // 1024
        print(f"ok {group}/{out.name} ({size} KB)")
        webm.unlink()

mux("student-ko")
mux("instructor-ko")
print("mux done")
