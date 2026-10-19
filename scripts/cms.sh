#!/usr/bin/env bash
# Builds the website's CMS (cms/), imports the committed content into a fresh SQLite database and serves it on
# 127.0.0.1:8080 until stopped. With --background it returns once the delivery API answers (the build uses this).
# With HYDROGEN_ADMIN_PASSWORD set it also creates the admin user `admin` (the database is local; users are not
# exported). After editing, `scripts/cms.sh --export` writes the content back to cms/content.
set -euo pipefail
cd "$(dirname "$0")/../cms"

export GOWORK=off
mkdir -p .work
go build -o .work/cms .

if [ "${1:-}" = --export ]; then
	# Writes the content of the running CMS's database back to content/ (commit it).
	rm -rf .work/export && ./.work/cms export .work/export && rm -rf content && mv .work/export content
	echo "exported to cms/content"
	exit 0
fi

rm -f .work/hydrogen.db*
./.work/cms migrate >/dev/null
./.work/cms import content
if [ -n "${HYDROGEN_ADMIN_PASSWORD:-}" ]; then ./.work/cms users:create-admin admin; fi

if [ "${1:-}" != --background ]; then
	exec ./.work/cms serve
fi
./.work/cms serve >.work/serve.log 2>&1 &
echo $! >.work/serve.pid
for _ in $(seq 100); do
	curl -sf http://127.0.0.1:8080/api/deliver/v1/channels/web >/dev/null && exit 0
	sleep 0.1
done
echo "cms: did not start; see cms/.work/serve.log" >&2
exit 1
