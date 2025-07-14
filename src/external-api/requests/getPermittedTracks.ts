import { trackPermissionSchema, type Track } from '@/models/track';

import { dataApi } from '../dataApi';
import { DATA_API_ENDPOINTS } from '../endpoints';

export const getPermittedTracks = async (tracks: Track[]) => {
  const trackIds = tracks.map(track => track.id);

  const response = await dataApi.post(DATA_API_ENDPOINTS.trackPermissions, {
    json: {
      ids: trackIds
    }
  }).json();
  const trackPermissions = trackPermissionSchema.array().parse(response);

  const permittedTracks = tracks.filter(track => {
    const trackPermission = trackPermissions.find(permissionForTrack => permissionForTrack.id === track.id);
    return trackPermission?.downloadable && trackPermission.playable;
  });

  return permittedTracks;
};
