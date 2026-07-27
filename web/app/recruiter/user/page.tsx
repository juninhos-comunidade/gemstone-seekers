import Image from "next/image";
import React from "react";

const nome = "Thiago";

export default function page() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">
          {nome}
          <span className="text-primary">
            {" "}
            <span className="text-muted-foreground">(Recrutador)</span>
          </span>
        </h1>
        <Image
          src={`https://ui-avatars.com/api/?name=${nome}`}
          alt="avatar"
          width={100}
          height={100}
        />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            elementum, dui non consectetur feugiat, leo tortor porttitor nibh.
          </p>
        </div>
      </div>
    </div>
  );
}
