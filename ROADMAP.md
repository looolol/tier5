Framing this specifically as a Legacy Collection Matrix for a fixed, post-update 9.7.0 final era of Destiny 2 changes the priority list entirely. Because the sandbox, weapon list, and drop pools are permanent, you are building the ultimate historical checklist.

Here is a complete features roadmap organized by logical implementation order, taking you from raw functionality to your dream "Trophy Room" display cases.

Phase 1: Foundational UI & Basic Inventory Control
You need a stable canvas and basic item mobility before constructing the specialized collection grids.

UI Layout Scaffolding: Side-by-side multi-character column layout featuring standard grid trays for currently equipped gear and sub-inventories.

The Basic Moving Parts (DIM Essentials):

Item Transfrer Endpoint: A basic backend proxy connection (POST) handling /TransferItem/ to let you quickly shuffle guns to/from the vault without opening another app.

Lock & Tag Controls: Toggle item locking (/SetLockState/) and local data tagging (e.g., flagging items as "Keep", "Fodder", or "Infusion material").

Item Identity Card (Tooltip/Drawer):

A micro-overlay showing high-res weapon name, frame archetype, damage element, and intrinsic origin trait.

External Quick-Links: Inline utility buttons that instantly open the item's page on light.gg or destinytracker for rapid community deep-dives.

Phase 2: The Wishlist, Perk Viewer & God Roll Engine
Before building the deficiency matrix, the app must understand what a "complete" slot actually means to you.

The Static Per-Item Perk Sheet: An expandable viewer inside the item card pulling the entire weapon socket definitions from your local SQLite/PostgreSQL manifest cache. It maps every possible muzzle, mag, and perk column combo available for that gun.

The Dual-Core Wishlist Parser:

The Community Seed: A backend script that clones or downloads public DIM community wishlist files (like voltron.txt or Aegis's end-game sheets), parsing them into your local DB via Prisma.

The Vanguard Custom Forge: An override UI where you can deselect community perks, tap the specific 2 or 4 perks you want, and save your custom God Roll blueprint.

The Live Inventory Roll Rater: An evaluation algorithm that scans your live vault items against the active wishlist blueprint, outputting a match metric (e.g., 2/2 Main Perks Match = Gold Icon Glow; 1/2 Perks Match = Translucent Silver).

Phase 3: The Elemental Collection Matrix & Farm Guide
The core engine. Turning your live inventory into an interactive heatmap of what you own versus what you need.

The Definitive Weapon Frame Archetype Matrix: A massive, scannable master grid displaying Weapon Categories as rows and Elemental Damage Types as columns.

Cells dynamically display your current best-rolled weapon matching that cross-section.

Empty cells render a dark, empty placeholder silhouette.

"Where to Farm" Static Atlas: A hardcoded database table mapping all ~150 legacy weapons to their permanent dropsources (e.g., Onslaught, Exotic Mission Rotator: Vox Obscura, Warlord's Ruin - 2nd Encounter).

Click-to-Brief Interaction: Clicking any empty silhouette cell queries the Atlas and populates a "Target Acquired" panel detailing exactly where to farm that missing element/archetype combination.

Phase 4: Active World & Vendor Tracking
Because the game loop is now a permanent calendar, the app can actively tell you when your missing targets are up for grabs.

Live Vendor Appraisal Alerts: A background polling job that checks Xûr, Banshee-44, and weekly planetary vendors on reset, running their live weapon inventory arrays through your custom Roll Rater Engine. If a vendor is selling a 90%+ match to one of your wishlist items, it triggers a dashboard alert.

Weekly Rotation Tracker: A compact sidebar module pulling current active playlist states (Featured Legacy Raid, Active Dungeon, Exotic Mission rotation) and cross-referencing them against your missing matrix items to show you your optimal playlist path for the week.

Phase 5: The Digital Trophy Room (Display Cabinets)
The ultimate artistic end-goal. Curating visual sets out of your hard-earned vault.

Custom Showcase Builder: A feature allowing you to build independent display shelves based on personal or thematic constraints.

Foundry Cabinets: "Tex Mechanica Wild West Collection", "Veist Poison Deck", "Omolon Liquid Ammo Rack".

Legacy Activity Cabinets: "Deep Stone Crypt Flawless Set", "Original Season of the Undying Relics".

The "Hole in the Shelf" Aesthetic: Curated cabinets display high-res asset renders of your specific guns side-by-side, visually calling out empty slots with strict labels (e.g., Missing: Succession Sniper Rifle).

Phase 6: Armor Min-Maxing (The Sandbox Final Frontier)
Once weapons are mastered, the framework pivots into building the ultimate stat-tier combinations.

Zero-Waste Armor Optimizer: An analytical solver that processes all armor plugs across your vault to group stat configurations into neat blocks of 10, highlighting combinations that reach "Triple 100s" while eliminating wasted residual digits (e.g., converting scores ending in 8 or 9 into flat, effective tiers).