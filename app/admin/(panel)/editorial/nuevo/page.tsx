import { EditorialForm } from "@/components/admin/editorial/EditorialForm";
import { FormHeader } from "@/components/admin/products/FormHeader";

export default function NewPostPage() {
  return (
    <>
      <FormHeader title="Nueva nota" backHref="/admin/editorial" />
      <EditorialForm mode="create" />
    </>
  );
}
