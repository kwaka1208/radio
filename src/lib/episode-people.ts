import people from '../../db/data/people';
import peoplePerEpisode from '../../db/data/people-per-episode';
import sponsors from '../../db/data/sponsors';
import sponsorsPerEpisode from '../../db/data/sponsors-per-episode';

// People treated as hosts when their per-episode `host` flag is not set.
// Mirrors the logic that used to run in the database seed script.
const DEFAULT_HOST_IDS = ['argyleink', 'chuckcarpenter', 'robbiethewagner'];

const peopleById = new Map(people.map((person) => [person.id, person]));
const sponsorsById = new Map(sponsors.map((sponsor) => [sponsor.id, sponsor]));

export interface HostOrGuest {
  id: string;
  img: string | null;
  isHost: boolean;
  name: string;
}

export interface EpisodeSponsor {
  id: string;
  img: string | null;
  name: string;
  url: string;
}

// Resolve the hosts and guests for an episode straight from the static data
// files, replacing the previous build-time database query.
export function getHostsAndGuests(episodeSlug: string): HostOrGuest[] {
  const refs = peoplePerEpisode[episodeSlug] ?? [];
  return refs.flatMap((ref) => {
    const person = peopleById.get(ref.id);
    if (!person) return [];
    return [
      {
        id: person.id,
        // Some people entries have no image.
        img: 'img' in person ? person.img : null,
        isHost:
          ref.host !== undefined
            ? Boolean(ref.host)
            : DEFAULT_HOST_IDS.includes(ref.id),
        name: person.name
      }
    ];
  });
}

// Resolve the sponsors for an episode from the static data files.
export function getSponsors(episodeSlug: string): EpisodeSponsor[] {
  const refs = sponsorsPerEpisode[episodeSlug] ?? [];
  return refs.flatMap((ref) => {
    const sponsor = sponsorsById.get(ref.id);
    if (!sponsor) return [];
    return [
      {
        id: sponsor.id,
        img: sponsor.img ?? null,
        name: sponsor.name,
        url: sponsor.url
      }
    ];
  });
}
