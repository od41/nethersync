import React from "react";
import { TransferIndexCard } from "./_components/transfer-index-card";

const FilesIndexPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="max-w-[360px]">
      <TransferIndexCard slug={params.slug} />
    </div>
  );
};

export default FilesIndexPage;
