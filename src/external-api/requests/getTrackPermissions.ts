import { trackPermissionSchema, type Track } from '@/models/track';

import { api } from '../api';
import { API_ENDPOINTS } from '../endpoints';

export const getTrackPermissions = async (trackIds: Track['id'][]) => {
  const trackPermissions = await api.post(API_ENDPOINTS.trackPermissions, {
    json: {
      ids: trackIds
    }
  }).json();

  return trackPermissionSchema.array().parse(trackPermissions);
};
