import { EditorialList } from "@/components/admin/editorial/EditorialList";
import { listAllPostsAdmin } from "@/lib/editorial/admin-queries";

export const dynamic = "force-dynamic";

export default async function EditorialPage() {
  const posts = await listAllPostsAdmin();
  return <EditorialList posts={posts} />;
}
