"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import type { Uc } from "@/lib/types";
import { updateUc } from "./actions";
import { UcForm } from "./uc-form";

export function UcEditModal({
  uc,
  isPersonal,
  onClose,
}: {
  uc: Uc;
  isPersonal: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const updateUcWithId = updateUc.bind(null, uc.id, isPersonal);

  return (
    <Modal title={`Editar UC — ${uc.codigo}`} onClose={onClose}>
      <UcForm
        action={updateUcWithId}
        initial={uc}
        editableCatalogo={isPersonal}
        onSuccess={() => {
          onClose();
          router.refresh();
        }}
      />
    </Modal>
  );
}
