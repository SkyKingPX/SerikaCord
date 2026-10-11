import DownloadClient from "./DownloadClient";
import { getLatestRelease } from "@/lib/downloads";

// Re-read the latest GitHub release every 10 minutes so new builds show up
// without a deploy.
export const revalidate = 600;

export default async function DownloadPage() {
  const release = await getLatestRelease();
  return <DownloadClient release={release} />;
}
