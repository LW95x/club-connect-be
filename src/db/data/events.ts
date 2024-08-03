import { EventsData } from "../../helpers/interfaces";

const eventsData: EventsData[] = [
  {
    homeClubId: 5,
    title: "Bath City vs. Maidstone United",
    location: "Twerton Park, 105 High St, Twerton, Bath, BA2 1DB",
    price: 10,
    dateTime: new Date("2024-09-21T15:00:00"),
    description:
      "A derby between local rivals, get yourselves down to Twerton Park for this huge encounter.",
    availableTickets: 8000,
  },
  {
    homeClubId: 3,
    title: "Torquay United vs. Bath City",
    location: "Plainmoor, Plainmoor Rd, Torquay TQ1 3PS",
    price: 20,
    dateTime: new Date("2024-09-28T15:00:00"),
    description:
      "A top of the table clash between 1st and 2nd in the National League South.",
    availableTickets: 6500,
  },
  {
    homeClubId: 4,
    title: "Stafford Rangers vs. Alfreton Town",
    location: "Marston Road, Stafford, ST16 3BX",
    price: 10,
    dateTime: new Date("2024-11-22T15:00:00"),
    description:
      "A battle in the North for a spot in the play-offs in the Northern Premier League.",
    availableTickets: 3000,
  },
  {
    homeClubId: 2,
    title: "Alfreton Town vs. Hyde United",
    location: "North Street, Alfreton, Derbyshire, DE55 7FZ",
    price: 5,
    dateTime: new Date("2024-08-29T15:00:00"),
    description: "The first of the new season, with fresh hope and ambition.",
    availableTickets: 3600,
  },
  {
    homeClubId: 1,
    title: "Wealdstone F.C. vs Barnet",
    location: "Grosvenor Vale, Ruislip, West London, HA4 6JQ",
    price: 30,
    dateTime: new Date("2025-05-12T15:00:00"),
    description:
      "The play-off final second-leg, a pivotal moment at the end of the season.",
    availableTickets: 4000,
  },
];

export default eventsData;
