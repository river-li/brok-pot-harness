"""Fetch a fixed public model into the workspace, then load only local files."""
import json
import os
from pathlib import Path


def model_path():
    manifest = json.loads(Path(__file__).with_name("model.json").read_text())
    return Path(os.environ.get("GROKBOT_SPEECH_MODEL_ROOT", "/models")) / manifest["revision"]


def ensure_model():
    manifest = json.loads(Path(__file__).with_name("model.json").read_text())
    destination = model_path()
    if all((destination / name).is_file() for name in manifest["files"]):
        return destination
    if os.environ.get("GROKBOT_SPEECH_OFFLINE") == "1":
        raise RuntimeError("The pinned Whisper model is not installed in the workspace.")
    from huggingface_hub import snapshot_download

    print("Downloading the pinned local Whisper model.", flush=True)
    snapshot_download(
        repo_id=manifest["repository"],
        revision=manifest["revision"],
        local_dir=destination,
        allow_patterns=manifest["files"],
        token=False,
    )
    return destination
