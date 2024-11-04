type GetOptions = {
  '$.xgafv'?: string;
  access_token?: string;
  acknowledgeAbuse?: boolean;
  alt?: string;
  callback?: string;
  fields?: string;
  fileId: string;
  includeLabels?: string;
  includePermissionsForView?: string;
  key?: string;
  oauth_token?: string;
  prettyPrint?: boolean;
  quotaUser?: string;
  supportsAllDrives?: boolean;
  supportsTeamDrives?: boolean;
  upload_protocol?: string;
  uploadType?: string;
};

export const getFile = async ({fileId, alt = "media", ...rest}: GetOptions) => {
  let response;

  try {
    response = await gapi.client.drive.files.get({
      fileId,
      alt,
      ...rest
    });
  } catch (err) {
    console.error(err);
    return;
  }

  const file = response.body

  return file;
};
