import { Album } from './album/interfaces/album.interface';
import { Artist } from './artist/interfaces/artist.interface';
import { Track } from './track/interfaces/track.interface';
import { User } from './user/interfaces/user.interface';

export const users: User[] = [];

export const artists: Artist[] = [];

export const albums: Album[] = [];

export const tracks: Track[] = [];

export const resetDependencies = (
  array: (Album | Track)[],
  key: 'artistId' | 'albumId',
  id: string,
) => {
  array.forEach((entry) => {
    if (entry[key] === id) entry[key] = null;
  });
};
