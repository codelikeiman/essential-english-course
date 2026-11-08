/**
 * Single source of truth for business facts. Rename the brand, change the
 * address or the phone number here and the whole site (copy, links, JSON-LD,
 * metadata) follows.
 *
 * Items marked TODO were not provided yet — please confirm before launch.
 */
export const site = {
  name: "Essential English Course",
  shortName: "EEC",
  foundedYear: 2005,

  address: {
    // TODO: add the house number, e.g. "Jalan Mawar No. 12".
    street: "Jalan Mawar",
    streetShort: "Jl. Mawar",
    locality: "Medan",
    region: "Sumatera Utara",
    // TODO: add the postal code.
    postalCode: "",
    country: "ID",
  },

  maps: {
    // TODO: replace both URLs with the school's exact Google Maps place
    // (Google Maps → Share → "Embed a map" for embedUrl, "Copy link" for linkUrl).
    embedUrl: "https://www.google.com/maps?q=Jalan%20Mawar%2C%20Medan&output=embed",
    linkUrl: "https://www.google.com/maps/search/?api=1&query=Jalan%20Mawar%2C%20Medan",
  },

  whatsapp: {
    display: "0852-8018-8803",
    /** Country code + number without the leading 0, used for wa.me links. */
    international: "6285280188803",
  },

  instagram: {
    // TODO: confirm the exact handle (the brief says @EEC).
    handle: "EEC",
    url: "https://www.instagram.com/EEC/",
  },

  hours: {
    /** How opening hours are written in each language. */
    display: {
      id: { open: "16.00", close: "21.00" },
      en: { open: "4 pm", close: "9 pm" },
    },
    /** 24h values for JSON-LD. */
    opens: "16:00",
    closes: "21:00",
    // TODO: opening days were not specified — assumed Monday–Saturday.
    // Update `days` here and `location.hoursDays` in messages/*.json.
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },

  classSizeMax: 15,
  levelDurationMonths: 6,

  /**
   * TODO: is 95 the number of current students or everyone since 2005?
   * It stays hidden until that's confirmed (95 across 21 years reads small
   * next to "since 2005"). Flip `show` to display it in the hero facts.
   */
  students: { count: 95, show: false },
} as const;

export type Site = typeof site;
