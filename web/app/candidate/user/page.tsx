import Image from "next/image";
import { MOCK_USER } from "../../../Mocks/userMock";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Image
          src={MOCK_USER.avatarUrl}
          alt={MOCK_USER.name}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{MOCK_USER.name}</h1>
          <p className="text-muted-foreground">{MOCK_USER.role}</p>
        </div>
      </div>

      {/* Resumo */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Sobre</h2>
        <p className="text-muted-foreground">{MOCK_USER.bio}</p>
      </section>

      {/* Experiências */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Experiência Profissional</h2>
        {MOCK_USER.experiences.map((exp) => (
          <div
            key={exp.id}
            className="border-l-2 border-primary pl-4 space-y-1"
          >
            <h3 className="font-medium">
              {exp.role} —{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {exp.company}
              </span>
            </h3>
            <span className="text-xs text-muted-foreground">{exp.period}</span>
            <p className="text-sm">{exp.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
