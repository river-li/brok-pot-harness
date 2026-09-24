#!/usr/bin/env python3
"""Add local marketplace RPC contracts to the retained coordinator build."""
from __future__ import annotations

import base64
import hashlib
import json
import re
import zlib
from pathlib import Path


EXPECTED_SOURCE_SHA256 = "1a12e3fc0bef06ae45e2c35feee8950a18c89ce4fcde55884dd275fd0124af13"


def _replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise ValueError(f"Expected one {label} anchor; found {count}")
    return source.replace(old, new, 1)


def _local_view_fields(definition: dict) -> None:
    properties = definition["properties"]
    share_url = properties["shareUrl"]
    share_url["type"] = ["null", "string"]
    properties.update({
        "builtIn": {"type": "boolean"},
        "dependencies": {"items": {"type": "string"}, "type": "array"},
        "editable": {"type": "boolean"},
        "gettingStarted": {
            "additionalProperties": False,
            "properties": {"skill": {"type": "string"}},
            "required": ["skill"],
            "type": "object",
        },
        "gettingStartedSkill": {"type": "string"},
        "localRecipe": {"type": "boolean"},
    })


def _patch_contract_schema(source: str) -> str:
    pattern = re.compile(r'var qA="([A-Za-z0-9+/=]+)"')
    matches = list(pattern.finditer(source))
    if len(matches) != 1:
        raise ValueError(f"Expected one compressed coordinator contract; found {len(matches)}")
    match = matches[0]
    schema = json.loads(zlib.decompress(base64.b64decode(match.group(1)), -15))
    definitions = schema["$defs"]

    for name in ("RegressionEraBotTemplateWireView", "SandBotTemplateWireView"):
        _local_view_fields(definitions[name])

    create_args = definitions["SandCreateAgentFromTemplateArgs"]
    create_args["properties"]["resumeSetupAfterReview"] = {"type": "boolean"}
    send_args = definitions["SandSendPromptArgs"]
    send_args["properties"]["automationWriteProvenance"] = {
        "enum": ["untrusted", "template_import"],
        "type": "string",
    }
    send_args["properties"]["recipeSetupOperationId"] = {"type": "string"}

    setup = definitions["SandCreateAgentFromTemplateResult"]["properties"]["setup"]["anyOf"][0]
    setup["properties"].update({
        "setupClientNonce": {"type": "string"},
        "setupOperationId": {"type": "string"},
        "setupPrompt": {
            "additionalProperties": False,
            "properties": {
                "prompt": {"type": "string"},
                "richText": {"type": "string"},
            },
            "required": ["prompt"],
            "type": "object",
        },
        "setupRecoveryRequired": {"type": "boolean"},
    })

    preview = {
        "additionalProperties": False,
        "properties": {
            "dependencies": {"items": {"type": "string"}, "type": "array"},
            "description": {"type": "string"},
            "gettingStartedSkill": {"type": "string"},
            "name": {"type": "string"},
            "plugins": {
                "items": {
                    "additionalProperties": False,
                    "properties": {
                        "description": {"type": "string"},
                        "name": {"type": "string"},
                        "pluginId": {"type": "string"},
                    },
                    "required": ["name", "pluginId"],
                    "type": "object",
                },
                "type": "array",
            },
            "routines": {
                "items": {
                    "additionalProperties": False,
                    "properties": {
                        "description": {"type": "string"},
                        "name": {"type": "string"},
                    },
                    "required": ["name", "description"],
                    "type": "object",
                },
                "type": "array",
            },
            "skills": {
                "items": {
                    "additionalProperties": False,
                    "properties": {
                        "description": {"type": "string"},
                        "name": {"type": "string"},
                    },
                    "required": ["name", "description"],
                    "type": "object",
                },
                "type": "array",
            },
        },
        "required": ["dependencies", "description", "name", "plugins", "routines", "skills"],
        "type": "object",
    }
    removal = {
        "additionalProperties": False,
        "properties": {"removed": {"type": "boolean"}},
        "required": ["removed"],
        "type": "object",
    }
    refresh = {
        "additionalProperties": False,
        "properties": {
            "pluginId": {"type": "string"},
            "refreshed": {"type": "boolean"},
        },
        "required": ["pluginId", "refreshed"],
        "type": "object",
    }
    for name, definition in {
        "LocalBotRecipePreview": preview,
        "LocalBotRecipeRemovalReply": removal,
        "LocalMarketplacePluginRefreshReply": refresh,
        "LocalBotRecipeJsonArgs": {
            "additionalProperties": False,
            "properties": {"recipeJson": {"type": "string"}},
            "required": ["recipeJson"],
            "type": "object",
        },
        "LocalBotRecipeUpdateArgs": {
            "additionalProperties": False,
            "properties": {
                "recipeJson": {"type": "string"},
                "shareId": {"type": "string"},
            },
            "required": ["recipeJson", "shareId"],
            "type": "object",
        },
        "LocalBotRecipeIdArgs": {
            "additionalProperties": False,
            "properties": {"shareId": {"type": "string"}},
            "required": ["shareId"],
            "type": "object",
        },
        "LocalMarketplacePluginRefreshArgs": {
            "additionalProperties": False,
            "properties": {"pluginId": {"type": "string"}},
            "required": ["pluginId"],
            "type": "object",
        },
    }.items():
        if name in definitions:
            raise ValueError(f"Coordinator already defines {name}; inspect upstream drift")
        definitions[name] = definition

    methods = schema["methods"]
    additions = {
        "previewLocalBotRecipe": {
            "args": {"$ref": "#/$defs/LocalBotRecipeJsonArgs"},
            "reply": {"$ref": "#/$defs/LocalBotRecipePreview"},
        },
        "importLocalBotRecipe": {
            "args": {"$ref": "#/$defs/LocalBotRecipeJsonArgs"},
            "reply": {"$ref": "#/$defs/SandBotTemplateGatewayView"},
        },
        "updateLocalBotRecipe": {
            "args": {"$ref": "#/$defs/LocalBotRecipeUpdateArgs"},
            "reply": {"$ref": "#/$defs/SandBotTemplateGatewayView"},
        },
        "removeLocalBotRecipe": {
            "args": {"$ref": "#/$defs/LocalBotRecipeIdArgs"},
            "reply": {"$ref": "#/$defs/LocalBotRecipeRemovalReply"},
        },
        "refreshLocalMarketplacePlugin": {
            "args": {"$ref": "#/$defs/LocalMarketplacePluginRefreshArgs"},
            "reply": {"$ref": "#/$defs/LocalMarketplacePluginRefreshReply"},
        },
    }
    for name, definition in additions.items():
        if name in methods:
            raise ValueError(f"Coordinator already exposes {name}; inspect upstream drift")
        methods[name] = definition

    compressor = zlib.compressobj(level=9, wbits=-15)
    raw_schema = json.dumps(schema, separators=(",", ":"), ensure_ascii=False).encode()
    encoded = base64.b64encode(compressor.compress(raw_schema) + compressor.flush()).decode()
    return source[: match.start(1)] + encoded + source[match.end(1) :]


def patch_local_coordinator(path: Path) -> None:
    source_bytes = path.read_bytes()
    digest = hashlib.sha256(source_bytes).hexdigest()
    if digest != EXPECTED_SOURCE_SHA256:
        raise ValueError(
            "Retained coordinator changed; local marketplace overlay requires review "
            f"(expected {EXPECTED_SOURCE_SHA256}, found {digest})"
        )
    source = source_bytes.decode("utf-8")
    source = _replace_once(
        source,
        'automationWriteProvenance:A(K(U_)),isFork:A(X()),traceparent:A(f())',
        'automationWriteProvenance:A(Pe(K(U_),K("template_import"))),recipeSetupOperationId:A(f()),isFork:A(X()),traceparent:A(f())',
        "sendPrompt validator",
    )
    source = _replace_once(
        source,
        'Sx=v({shareId:f(),agentId:f(),name:f(),avatarShape:f(),avatarColor:f(),expectedActiveVersion:Z(),creatorContext:A(f())})',
        'Sx=v({shareId:f(),agentId:f(),name:f(),avatarShape:f(),avatarColor:f(),expectedActiveVersion:Z(),creatorContext:A(f()),resumeSetupAfterReview:A(X())})',
        "template import validator",
    )
    source = _replace_once(
        source,
        'listBotTemplates:_().noArgs,getBotTemplateVersion:_().args(cx),getBotTemplateForSourceAgent:_().args(ux)',
        'listBotTemplates:_().noArgs,getBotTemplateVersion:_().args(cx),previewLocalBotRecipe:_().args({recipeJson:f()}),importLocalBotRecipe:_().args({recipeJson:f()}),updateLocalBotRecipe:_().args({shareId:f(),recipeJson:f()}),removeLocalBotRecipe:_().args({shareId:f()}),getBotTemplateForSourceAgent:_().args(ux)',
        "local recipe method validators",
    )
    source = _replace_once(
        source,
        'updateMcpPluginInstall:_().args(ab),removeMcpServer:_().args(nA)',
        'updateMcpPluginInstall:_().args(ab),refreshLocalMarketplacePlugin:_().args({pluginId:f()}),removeMcpServer:_().args(nA)',
        "marketplace refresh method validator",
    )
    source = _replace_once(
        source,
        'listBotTemplates:{args:"none",reply:"array"},getBotTemplateVersion:{args:"object",reply:"record"}',
        'listBotTemplates:{args:"none",reply:"array"},getBotTemplateVersion:{args:"object",reply:"record"},previewLocalBotRecipe:{args:"object",reply:"record"},importLocalBotRecipe:{args:"object",reply:"record"},updateLocalBotRecipe:{args:"object",reply:"record"},removeLocalBotRecipe:{args:"object",reply:"record"},refreshLocalMarketplacePlugin:{args:"object",reply:"record"}',
        "coordinator method reply whitelist",
    )
    source = _patch_contract_schema(source)
    path.write_text(source, encoding="utf-8")
