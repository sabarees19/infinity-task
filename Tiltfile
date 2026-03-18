# ---------------------------------------------------------------------------
# Tiltfile — infinity-task
# Provides live-reload dev loop with Docker + Pino structured log streaming.
# ---------------------------------------------------------------------------

# ── Settings ────────────────────────────────────────────────────────────────
update_settings(max_parallel_updates = 3)

# ── Redis (use docker-compose service) ──────────────────────────────────────
docker_compose("./docker-compose.yml")

# Label resources and declare that app must wait for redis to be healthy.
# NOTE: readiness_probe is only available for k8s_resource, not dc_resource.
# Readiness is handled by the docker-compose healthcheck on the redis service.
dc_resource("app", labels=["backend"], resource_deps=["redis"])
dc_resource("redis", labels=["infra"])

# ── Build the app image using the 'development' stage ───────────────────────
docker_build(
    "infinity-app",           # image name (must match docker-compose image or build context)
    ".",
    dockerfile = "Dockerfile",
    target = "development",   # use the dev stage (tsx watch)
    # Sync src/ changes directly into the container without a full rebuild:
    live_update = [
        # 1. Sync local ./src → /app/src inside the container
        sync("./src", "/app/src"),
        # 2. After sync, tsx watch detects the change and auto-restarts —
        #    no extra run() step needed because tsx --watch handles it.
    ],
    # Ignore files that should not trigger a rebuild:
    ignore = [
        "dist/",
        "node_modules/",
        ".git/",
        "*.md",
        ".env*",
        "Tiltfile",
    ],
)


