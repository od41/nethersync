import React from "react";
import { FilesIndexCard } from "./_components/files-index-card";

const FilesIndexPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="max-w-[360px]">
      <FilesIndexCard />
    </div>
  );
};

export default FilesIndexPage;
