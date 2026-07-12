// Photo collections shown on the /photos/[category] pages.
// Images live in public/photos/ (currently placeholder gradients in temp/ —
// see public/photos/README.md). width/height must match the actual file so
// the gallery frames take the shape of each picture.

export type CollectionPhoto = {
  src: string;
  width: number;
  height: number;
  title: string;
  description: string;
  exif: {
    aperture: string;
    shutter: string;
    iso: number;
  };
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gradient: string;
  photos: CollectionPhoto[];
};

// Plausible camera settings per genre, cycled by frame index. Placeholder
// data like everything else here — replace with real EXIF when dropping in
// actual exports.
const EXIF_POOLS: Record<string, { aperture: string; shutter: string; iso: number }[]> = {
  portrait: [
    { aperture: "f/1.8", shutter: "1/250", iso: 200 },
    { aperture: "f/2.0", shutter: "1/320", iso: 100 },
    { aperture: "f/2.8", shutter: "1/200", iso: 400 },
    { aperture: "f/1.4", shutter: "1/500", iso: 100 },
  ],
  street: [
    { aperture: "f/5.6", shutter: "1/500", iso: 400 },
    { aperture: "f/8", shutter: "1/1000", iso: 800 },
    { aperture: "f/4", shutter: "1/250", iso: 1600 },
    { aperture: "f/7.1", shutter: "1/640", iso: 400 },
  ],
  landscape: [
    { aperture: "f/11", shutter: "1/60", iso: 100 },
    { aperture: "f/8", shutter: "1/125", iso: 100 },
    { aperture: "f/16", shutter: "2s", iso: 100 },
    { aperture: "f/13", shutter: "90s", iso: 64 },
  ],
  nature: [
    { aperture: "f/5.6", shutter: "1/2000", iso: 800 },
    { aperture: "f/4", shutter: "1/1000", iso: 1600 },
    { aperture: "f/8", shutter: "1/125", iso: 400 },
    { aperture: "f/6.3", shutter: "1/1600", iso: 3200 },
  ],
  night: [
    { aperture: "f/1.4", shutter: "1/60", iso: 3200 },
    { aperture: "f/2", shutter: "1/30", iso: 6400 },
    { aperture: "f/2.8", shutter: "30s", iso: 1600 },
    { aperture: "f/1.8", shutter: "1/80", iso: 2500 },
  ],
  studio: [
    { aperture: "f/8", shutter: "1/200", iso: 100 },
    { aperture: "f/11", shutter: "1/160", iso: 100 },
    { aperture: "f/5.6", shutter: "1/200", iso: 200 },
    { aperture: "f/9", shutter: "1/8000", iso: 100 },
  ],
  product: [
    { aperture: "f/11", shutter: "1/160", iso: 100 },
    { aperture: "f/8", shutter: "1/200", iso: 100 },
    { aperture: "f/16", shutter: "1/125", iso: 100 },
    { aperture: "f/10", shutter: "1/160", iso: 200 },
  ],
  architecture: [
    { aperture: "f/8", shutter: "1/250", iso: 100 },
    { aperture: "f/11", shutter: "1/125", iso: 200 },
    { aperture: "f/9", shutter: "1/320", iso: 100 },
    { aperture: "f/7.1", shutter: "1/500", iso: 400 },
  ],
  events: [
    { aperture: "f/2.8", shutter: "1/250", iso: 1600 },
    { aperture: "f/2", shutter: "1/200", iso: 3200 },
    { aperture: "f/2.8", shutter: "1/320", iso: 800 },
    { aperture: "f/1.8", shutter: "1/160", iso: 2000 },
  ],
};

// Placeholder dimensions by filename index — replace per-photo when dropping
// in real exports.
const tempPhoto = (
  slug: string,
  index: number,
  size: [number, number],
  title: string,
  description: string
): CollectionPhoto => {
  const pool = EXIF_POOLS[slug];
  return {
    src: `/photos/temp/${slug}-${index}.jpg`,
    width: size[0],
    height: size[1],
    title,
    description,
    exif: pool[(index - 1) % pool.length],
  };
};

export const collections: Collection[] = [
  {
    slug: "portrait",
    name: "Portraits",
    tagline: "Faces, held still",
    description:
      "Studio and natural-light portraiture. Slow sessions, honest expressions — the kind of frames people keep.",
    gradient: "from-amber-500 to-orange-800",
    photos: [
      tempPhoto("portrait", 1, [1200, 1600], "Golden Hour", "Backlit at f/1.8 in the last twenty minutes of light."),
      tempPhoto("portrait", 2, [1200, 1500], "Quiet Study", "Single softbox, black backdrop, nowhere to hide."),
      tempPhoto("portrait", 3, [1600, 1200], "Between Takes", "Caught off-script — the frame before the pose."),
      tempPhoto("portrait", 4, [1200, 1200], "Head On", "Square crop, direct gaze, no retouching."),
      tempPhoto("portrait", 5, [1600, 1200], "Window Seat", "North-facing window light and a long conversation."),
      tempPhoto("portrait", 6, [1000, 1600], "Full Length", "One light, one wall, a whole personality."),
      tempPhoto("portrait", 7, [1600, 840], "Wide Open", "Environmental portrait letting the room speak."),
      tempPhoto("portrait", 8, [1300, 1300], "Mirror Test", "A portrait the subject didn't expect to like."),
      tempPhoto("portrait", 9, [1500, 1000], "Two Chairs", "A double portrait with a metre of silence between."),
      tempPhoto("portrait", 10, [1100, 1500], "Blue Hour Face", "Ambient dusk balanced against one warm LED."),
      tempPhoto("portrait", 11, [1600, 950], "Working Hands", "A luthier at the bench, face out of frame on purpose."),
      tempPhoto("portrait", 12, [1350, 1350], "First Frame", "The test shot that ended up being the keeper."),
    ],
  },
  {
    slug: "street",
    name: "Street",
    tagline: "The city, unposed",
    description:
      "Unstaged moments from sidewalks, alleys, and transit platforms. Shot fast, cropped honest.",
    gradient: "from-slate-600 to-cyan-900",
    photos: [
      tempPhoto("street", 1, [1600, 900], "Rush Hour", "Four strangers, one crosswalk, perfect spacing."),
      tempPhoto("street", 2, [1000, 1500], "City After Rain", "Neon doubled in the pavement on King Street."),
      tempPhoto("street", 3, [1600, 1100], "Corner Store", "Fluorescent glow spilling onto the curb at midnight."),
      tempPhoto("street", 4, [1200, 1200], "Umbrella Math", "Geometry that only happens in bad weather."),
      tempPhoto("street", 5, [1600, 1200], "Streetcar Window", "Commuters framed by fogged glass."),
      tempPhoto("street", 6, [1000, 1600], "Alley Light", "A single shaft of sun between two towers."),
      tempPhoto("street", 7, [1600, 840], "Platform Six", "The long wait, stretched across the frame."),
      tempPhoto("street", 8, [1300, 1300], "Newsstand", "A holdout from another decade, still open."),
      tempPhoto("street", 9, [1500, 1000], "Market Close", "Vendors packing down in the last usable light."),
      tempPhoto("street", 10, [1100, 1500], "Fire Escape", "Zigzag shadows climbing a brick face."),
      tempPhoto("street", 11, [1600, 950], "Intersection", "Shot from the overpass while the light held."),
      tempPhoto("street", 12, [1350, 1350], "Dog at the Door", "A regular waiting outside the bakery, as always."),
    ],
  },
  {
    slug: "landscape",
    name: "Landscapes",
    tagline: "Big light, bigger patience",
    description:
      "Long drives, early alarms, and weather that never cooperates. Wide frames from wherever the road ends.",
    gradient: "from-emerald-700 to-teal-950",
    photos: [
      tempPhoto("landscape", 1, [1600, 760], "Northern Escape", "Panorama stitched at dawn above the treeline."),
      tempPhoto("landscape", 2, [1600, 1000], "Fog Bank", "The lake disappearing into itself at 6 a.m."),
      tempPhoto("landscape", 3, [1600, 900], "Last Ridge", "Ten-stop filter, ninety seconds of wind."),
      tempPhoto("landscape", 4, [1200, 1500], "Falls, Vertical", "Shot tall to keep the whole drop in frame."),
      tempPhoto("landscape", 5, [1600, 1200], "Open Range", "Nothing but grass and weather for sixty kilometres."),
      tempPhoto("landscape", 6, [1000, 1600], "Canyon Slot", "Light bouncing three times before it lands."),
      tempPhoto("landscape", 7, [1600, 840], "Shoreline", "The tide drawing its own long exposure."),
      tempPhoto("landscape", 8, [1300, 1300], "Lone Pine", "One tree holding the composition together."),
      tempPhoto("landscape", 9, [1500, 1000], "Storm Shelf", "The front arriving faster than the forecast said."),
      tempPhoto("landscape", 10, [1100, 1500], "River Bend", "Looking down the valley from the last switchback."),
      tempPhoto("landscape", 11, [1600, 950], "Dune Line", "Wind drawing clean curves in the sand."),
      tempPhoto("landscape", 12, [1350, 1350], "Tarn Mirror", "A windless minute at altitude, used well."),
    ],
  },
  {
    slug: "nature",
    name: "Nature",
    tagline: "Closer to the ground",
    description:
      "Macro and wildlife work — the small dramas that happen whether or not anyone is watching.",
    gradient: "from-green-700 to-lime-950",
    photos: [
      tempPhoto("nature", 1, [1200, 1600], "Fern Unfurling", "Macro at f/4, focus-stacked from nine frames."),
      tempPhoto("nature", 2, [1600, 1000], "Heron, Waiting", "Forty minutes of stillness before the strike."),
      tempPhoto("nature", 3, [1200, 1200], "Moss World", "A forest floor that reads like a landscape."),
      tempPhoto("nature", 4, [1600, 760], "Wetland Dawn", "Mist burning off the marsh in first light."),
      tempPhoto("nature", 5, [1600, 1200], "Deer Crossing", "One glance back before the trees closed."),
      tempPhoto("nature", 6, [1000, 1600], "Old Growth", "Looking straight up a two-hundred-year trunk."),
      tempPhoto("nature", 7, [1600, 840], "Murmuration", "Starlings rewriting the sky every second."),
      tempPhoto("nature", 8, [1300, 1300], "Frost Lattice", "Ice crystals on a window, backlit at sunrise."),
      tempPhoto("nature", 9, [1500, 1000], "Fox Path", "Ten seconds of eye contact before it moved on."),
      tempPhoto("nature", 10, [1100, 1500], "Rain Beads", "A spider web strung with the morning's weather."),
      tempPhoto("nature", 11, [1600, 950], "Geese South", "The vee crossing a colourless November sky."),
      tempPhoto("nature", 12, [1350, 1350], "Mushroom Ring", "A full circle found two steps off the trail."),
    ],
  },
  {
    slug: "night",
    name: "Night",
    tagline: "After the light leaves",
    description:
      "High ISO, steady hands, and the colours cities only show after dark — astro included when the sky allows.",
    gradient: "from-fuchsia-700 to-indigo-950",
    photos: [
      tempPhoto("night", 1, [1600, 900], "Late Night Neon", "Signage doing the work the sun clocked out of."),
      tempPhoto("night", 2, [1200, 1600], "Stairwell Glow", "Sodium vapour against a violet sky."),
      tempPhoto("night", 3, [1200, 1200], "Full Moon Block", "One streetlamp versus the moon, calling it a draw."),
      tempPhoto("night", 4, [1600, 1100], "Highway Ribbon", "Thirty seconds of taillights headed elsewhere."),
      tempPhoto("night", 5, [1600, 1200], "Diner at Two", "The only lit window on the block."),
      tempPhoto("night", 6, [1000, 1600], "Tower Fog", "A skyscraper dissolving upward into cloud."),
      tempPhoto("night", 7, [1600, 840], "Milky Way Drive", "Two hours from the city, zero light pollution."),
      tempPhoto("night", 8, [1300, 1300], "Reflection Pool", "The skyline upside down and twice as calm."),
      tempPhoto("night", 9, [1500, 1000], "Gas Station Glow", "An island of fluorescent white in the dark."),
      tempPhoto("night", 10, [1100, 1500], "Rain on Glass", "Bokeh stacked three streets deep."),
      tempPhoto("night", 11, [1600, 950], "Last Ferry", "The terminal lights stretching across the harbour."),
      tempPhoto("night", 12, [1350, 1350], "Window Grid", "One insomniac lit window in a sleeping block."),
    ],
  },
  {
    slug: "studio",
    name: "Studio",
    tagline: "Light, built by hand",
    description:
      "Controlled-light work — still life, portrait tests, and experiments where every shadow is a decision.",
    gradient: "from-stone-500 to-neutral-800",
    photos: [
      tempPhoto("studio", 1, [1200, 1200], "Still Life Study", "Three grey cards and an hour of moving one lamp."),
      tempPhoto("studio", 2, [1200, 1500], "Paper Backdrop", "Seamless white, hard key, no fill."),
      tempPhoto("studio", 3, [1600, 1200], "Gel Test", "Amber against teal, straight out of camera."),
      tempPhoto("studio", 4, [1400, 1050], "Smoke Shape", "A haze machine and one snooted strobe."),
      tempPhoto("studio", 5, [1600, 1200], "Table Top", "Product light borrowed for a bowl of fruit."),
      tempPhoto("studio", 6, [1000, 1600], "Fabric Fall", "Silk mid-drop, frozen at 1/8000."),
      tempPhoto("studio", 7, [1600, 840], "Shadow Play", "Cardboard gobos cutting the key into stripes."),
      tempPhoto("studio", 8, [1300, 1300], "Glass Study", "Backlit glassware on black acrylic."),
      tempPhoto("studio", 9, [1500, 1000], "Ink Drop", "Pigment blooming in a tank of still water."),
      tempPhoto("studio", 10, [1100, 1500], "Profile Cut", "A rim light doing all the talking."),
      tempPhoto("studio", 11, [1600, 950], "Flour Burst", "One clap, one flash, one very dusty studio."),
      tempPhoto("studio", 12, [1350, 1350], "Colour Wheel", "Gel tests arranged into something worth keeping."),
    ],
  },
  {
    slug: "product",
    name: "Product",
    tagline: "Objects, flattered",
    description:
      "Clean commercial frames for brands and makers — from single-light lookbooks to full campaign sets.",
    gradient: "from-rose-700 to-red-950",
    photos: [
      tempPhoto("product", 1, [1200, 1200], "Watch Face", "Focus-stacked macro with a polarizer on the glass."),
      tempPhoto("product", 2, [1200, 1500], "Bottle Drop", "Splash frozen with a four-flash array."),
      tempPhoto("product", 3, [1600, 1000], "Flat Lay", "A maker's kit arranged on raw linen."),
      tempPhoto("product", 4, [1600, 900], "Sneaker Float", "Fishing line, patience, and retouching."),
      tempPhoto("product", 5, [1600, 1200], "Ceramics Set", "Earthenware on a matched clay backdrop."),
      tempPhoto("product", 6, [1000, 1600], "Perfume Column", "Tall crop for a tall bottle, lit through smoke."),
      tempPhoto("product", 7, [1600, 840], "Knife Roll", "Steel catching one long strip light."),
      tempPhoto("product", 8, [1300, 1300], "Coffee Bag", "Packaging hero shot for a local roaster."),
      tempPhoto("product", 9, [1500, 1000], "Leather Goods", "A wallet lineup lit like a still life."),
      tempPhoto("product", 10, [1100, 1500], "Candle Column", "Warm practicals against a cold backdrop."),
      tempPhoto("product", 11, [1600, 950], "Tool Wall", "A maker's bench shot straight-on for the catalogue."),
      tempPhoto("product", 12, [1350, 1350], "Ring Macro", "Stacked at f/8 until every facet held."),
    ],
  },
  {
    slug: "architecture",
    name: "Architecture",
    tagline: "Lines that hold still",
    description:
      "Buildings, interiors, and the geometry between them. Verticals kept vertical, mostly.",
    gradient: "from-cyan-700 to-slate-900",
    photos: [
      tempPhoto("architecture", 1, [1000, 1500], "Atrium Climb", "Looking up twelve storeys of repeating glass."),
      tempPhoto("architecture", 2, [1200, 1600], "Brutalist Face", "Concrete at noon — shadows doing the design work."),
      tempPhoto("architecture", 3, [1600, 1000], "Terminal Curve", "An airport roofline shot at closing time."),
      tempPhoto("architecture", 4, [1200, 1200], "Grid Square", "One façade, cropped until only rhythm remains."),
      tempPhoto("architecture", 5, [1600, 1200], "Library Hall", "Symmetry from the exact centre of the aisle."),
      tempPhoto("architecture", 6, [1000, 1600], "Spiral Core", "A staircase shot straight down the well."),
      tempPhoto("architecture", 7, [1600, 840], "Bridge Deck", "Cables slicing the sky into wedges."),
      tempPhoto("architecture", 8, [1300, 1300], "Courtyard Frame", "A window onto a window onto a garden."),
      tempPhoto("architecture", 9, [1500, 1000], "Concrete Wave", "A parking structure most people never look up at."),
      tempPhoto("architecture", 10, [1100, 1500], "Elevator Shaft", "Glass cars climbing a lit spine."),
      tempPhoto("architecture", 11, [1600, 950], "Rooftop Field", "HVAC geometry standing in for sculpture."),
      tempPhoto("architecture", 12, [1350, 1350], "Tile Repeat", "A subway wall pattern, centred to the millimetre."),
    ],
  },
  {
    slug: "events",
    name: "Events",
    tagline: "Moments, not poses",
    description:
      "Weddings, launches, and live shows — documentary coverage that stays out of the way until it matters.",
    gradient: "from-amber-600 to-purple-950",
    photos: [
      tempPhoto("events", 1, [1600, 1000], "First Dance", "One off-camera flash and a disco ball."),
      tempPhoto("events", 2, [1200, 1600], "Confetti Drop", "The half-second the whole night builds toward."),
      tempPhoto("events", 3, [1600, 900], "Stage Wash", "A guitarist silhouetted in magenta haze."),
      tempPhoto("events", 4, [1200, 1200], "The Toast", "Caught mid-laugh, glass already raised."),
      tempPhoto("events", 5, [1600, 1200], "Full Room", "The venue at peak, shot from the balcony."),
      tempPhoto("events", 6, [1000, 1600], "Backstage", "Five minutes to doors, nerves in a tall frame."),
      tempPhoto("events", 7, [1600, 840], "Head Table", "The wide view nobody at the party ever sees."),
      tempPhoto("events", 8, [1300, 1300], "Sparkler Exit", "Long exposure, short goodbye."),
      tempPhoto("events", 9, [1500, 1000], "Soundcheck", "An empty room an hour before it wasn't."),
      tempPhoto("events", 10, [1100, 1500], "The Dress", "Hung in the window light before the ceremony."),
      tempPhoto("events", 11, [1600, 950], "Crowd Surf", "The wide shot from the photo pit, lens up."),
      tempPhoto("events", 12, [1350, 1350], "Cake Cut", "Two hands, one knife, forty phones."),
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
