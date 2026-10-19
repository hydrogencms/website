// Command cms is the content of the Hydrogen website: the landing pages, edited in Hydrogen's own admin. The Astro
// site at the repository root renders them, together with the docs from the hydrogen repository. The content is
// committed in content/ (hydrogen export); `npm run cms` imports it into a fresh SQLite database and serves it.
package main

import (
	"github.com/hydrogencms/hydrogen"
	"github.com/hydrogencms/hydrogen/modules/pages"
	"github.com/hydrogencms/hydrogen/modules/sqlite"
)

func main() { hydrogen.Main(configure) }

func configure(h *hydrogen.Builder) {
	h.Use(sqlite.Module(), pages.Module())
}
