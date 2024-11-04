
type SearchOptions = {
    "$.xgafv"?: string;
    access_token?: string;
    alt?: string;
    callback?: string;
    corpora?: string;
    corpus?: string;
    driveId?: string;
    fields?: string;
    includeItemsFromAllDrives?: boolean;
    includeLabels?: string;
    includePermissionsForView?: string;
    includeTeamDriveItems?: boolean;
    key?: string;
    oauth_token?: string;
    orderBy?: string;
    pageSize?: number;
    pageToken?: string;
    prettyPrint?: boolean;
    q?: string;
    quotaUser?: string;
    spaces?: string;
    supportsAllDrives?: boolean;
    supportsTeamDrives?: boolean;
    teamDriveId?: string;
    upload_protocol?: string;
    uploadType?: string;
}

export const searchFile = async ({pageSize = 10, q, ...rest }: SearchOptions) => {
  let response;

  try {
    response = await gapi.client.drive.files.list({
      pageSize,
      q,
      ...rest
    });
  } catch (err) {
    console.error(err);
    return;
  }

  const files = response.result.files;

  if (!files || files.length <= 0) return undefined;
  return files;
}