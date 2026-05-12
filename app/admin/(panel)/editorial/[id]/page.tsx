import { notFound } from "next/navigation";
import { EditorialForm } from "@/components/admin/editorial/EditorialForm";
import { FormHeader } from "@/components/admin/products/FormHeader";
import { getPostByIdAdmin } from "@/lib/editorial/admin-queries";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <>
      <FormHeader title="Editar nota" subtitle={post.title} backHref="/admin/editorial" />
      <EditorialForm mode="edit" post={post} />
    </>
  );
}
