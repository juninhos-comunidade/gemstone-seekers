"use client";

import React from "react";
import Link from "next/link";
import { CandidateProfileResponse } from "@/lib/types/candidate";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPen,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  User,
  CheckCircle2,
  Globe,
  Languages,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateProfileViewProps {
  initialData: CandidateProfileResponse | null;
}

export function CandidateProfileView({
  initialData,
}: CandidateProfileViewProps) {
  const candidate = initialData?.candidate;
  const address = initialData?.address;
  const user = candidate?.user;

  if (!candidate || !user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      <Card className="border-border/60 bg-card/80 relative overflow-hidden shadow-sm backdrop-blur">
        <div className="from-primary/20 via-primary/10 dark:from-primary/30 dark:via-primary/20 h-32 bg-gradient-to-r to-indigo-500/10 dark:to-purple-950/20" />
        <CardContent className="relative px-6 pt-0 pb-6">
          <div className="-mt-12 mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex items-end gap-4">
              <div className="bg-primary text-primary-foreground ring-background relative flex size-24 shrink-0 items-center justify-center rounded-2xl text-3xl font-bold shadow-lg ring-4">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-foreground text-2xl font-bold tracking-tight">
                    {user.name}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs font-medium"
                  >
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    Candidato
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>

            <Link
              href="/candidate/user/edit"
              className={cn(
                buttonVariants({ variant: "default" }),
                "shrink-0 gap-2 shadow-sm",
              )}
            >
              <UserPen className="size-4" />
              Editar Perfil
            </Link>
          </div>

          <div className="border-border/50 grid grid-cols-1 gap-3 border-t pt-4 text-sm sm:grid-cols-3">
            <div className="text-muted-foreground flex items-center gap-2.5">
              <Mail className="text-primary/70 size-4 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2.5">
              <Phone className="text-primary/70 size-4 shrink-0" />
              <span>
                {candidate.phone || (
                  <span className="text-muted-foreground/60 italic">
                    Não informado
                  </span>
                )}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2.5">
              <CreditCard className="text-primary/70 size-4 shrink-0" />
              <span>
                {user.documentType && user.documentNumber ? (
                  `${user.documentType}: ${user.documentNumber}`
                ) : (
                  <span className="text-muted-foreground/60 italic">
                    Documento não informado
                  </span>
                )}
              </span>
            </div>
          </div>

          {candidate.links && candidate.links.length > 0 && (
            <div className="border-border/40 mt-3 flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                <Globe className="size-3.5" /> Links:
              </span>
              {candidate.links.map((link) => (
                <a
                  key={link.id || link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary bg-primary/10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium hover:underline"
                >
                  {link.name}
                  <ExternalLink className="size-3" />
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-border/60 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="text-primary size-4" />
              Resumo Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            {candidate.summary ? (
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {candidate.summary}
              </p>
            ) : (
              <p className="text-muted-foreground/60 text-sm italic">
                Nenhum resumo informado ainda.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="text-primary size-4" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {address && address.street ? (
              <div className="text-muted-foreground space-y-1.5">
                <p className="text-foreground font-medium">
                  {address.street}, {address.number}
                </p>
                {address.complement && (
                  <p className="text-xs">{address.complement}</p>
                )}
                <p>{address.neighborhood}</p>
                <p>{address.city?.name || "Cidade não informada"}</p>
                <p className="text-muted-foreground/80 pt-1 font-mono text-xs">
                  CEP: {address.zipCode}
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground/60 py-2 text-sm italic">
                Endereço não cadastrado.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="text-primary size-4" />
            Experiência Profissional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!candidate.experiences || candidate.experiences.length === 0 ? (
            <p className="text-muted-foreground/60 text-sm italic">
              Nenhuma experiência profissional cadastrada.
            </p>
          ) : (
            candidate.experiences.map((exp) => (
              <div
                key={exp.id || exp.title}
                className="border-primary space-y-1 border-l-2 py-1 pl-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground text-sm font-semibold">
                    {exp.title}{" "}
                    <span className="text-muted-foreground font-normal">
                      — {exp.companyName}
                    </span>
                  </h3>
                  {exp.isCurrent && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 text-[10px] text-emerald-600 dark:text-emerald-400"
                    >
                      Atual
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                  <Calendar className="size-3" />
                  {exp.startDate}{" "}
                  {exp.isCurrent
                    ? " - Presente"
                    : exp.endDate
                      ? ` - ${exp.endDate}`
                      : ""}
                </p>
                {exp.description && (
                  <p className="text-muted-foreground/90 pt-1 text-xs leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="text-primary size-4" />
              Educação & Formação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!candidate.educations || candidate.educations.length === 0 ? (
              <p className="text-muted-foreground/60 text-sm italic">
                Nenhuma formação acadêmica cadastrada.
              </p>
            ) : (
              candidate.educations.map((edu) => (
                <div
                  key={edu.id || edu.institution}
                  className="border-primary/70 space-y-1 border-l-2 py-1 pl-4"
                >
                  <h3 className="text-foreground text-sm font-semibold">
                    {edu.institution}
                  </h3>
                  <p className="text-muted-foreground text-xs font-medium">
                    {edu.fieldOfStudy} {edu.degree ? `(${edu.degree})` : ""}
                  </p>
                  {(edu.startDate || edu.completionDate) && (
                    <p className="text-muted-foreground/80 font-mono text-xs">
                      {edu.startDate ? edu.startDate : ""}{" "}
                      {edu.completionDate ? `a ${edu.completionDate}` : ""}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="text-primary size-4" />
              Certificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!candidate.certifications ||
            candidate.certifications.length === 0 ? (
              <p className="text-muted-foreground/60 text-sm italic">
                Nenhuma certificação cadastrada.
              </p>
            ) : (
              candidate.certifications.map((cert) => (
                <div
                  key={cert.id || cert.name}
                  className="border-primary/70 space-y-1 border-l-2 py-1 pl-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground text-sm font-semibold">
                      {cert.name}
                    </h3>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center gap-0.5 text-xs hover:underline"
                      >
                        Verificar <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Emissor: {cert.issuingOrganization}
                  </p>
                  {cert.issueDate && (
                    <p className="text-muted-foreground/80 font-mono text-xs">
                      Emitido em {cert.issueDate}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderGit2 className="text-primary size-4" />
            Projetos & Portfólio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!candidate.projects || candidate.projects.length === 0 ? (
            <p className="text-muted-foreground/60 text-sm italic">
              Nenhum projeto cadastrado.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {candidate.projects.map((proj) => (
                <div
                  key={proj.id || proj.name}
                  className="border-border/50 bg-muted/20 space-y-2 rounded-xl border p-4"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-foreground text-sm font-bold">
                      {proj.name}
                    </h3>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center gap-0.5 text-xs hover:underline"
                      >
                        Link <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Languages className="text-primary size-4" />
            Idiomas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!candidate.languages || candidate.languages.length === 0 ? (
            <p className="text-muted-foreground/60 text-sm italic">
              Nenhum idioma cadastrado.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {candidate.languages.map((lang) => (
                <Badge
                  key={lang.languageId || lang.languageName}
                  variant="secondary"
                  className="px-3 py-1 text-xs"
                >
                  {lang.languageName} —{" "}
                  <span className="text-muted-foreground ml-1 font-normal">
                    {lang.proficiency}
                  </span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
