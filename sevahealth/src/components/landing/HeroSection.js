import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";

function Stat({ label, value, trend, tone = "default" }) {
  return (
    <div className="space-y-1 rounded-lg border bg-background/60 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
      {trend && (
        <p
          className={
            tone === "destructive"
              ? "text-xs text-destructive"
              : "text-xs text-emerald-600 dark:text-emerald-400"
          }
        >
          {trend}
        </p>
      )}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted">
      {/* Background image + overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt="Healthcare workers in the community"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 md:flex-row md:items-center md:py-24">
        {/* Left: text & CTA */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-secondary/80">
              Built for ASHA & field health workers
            </Badge>
            <span className="text-xs text-muted-foreground">
              Offline-first · Multi-village · Real-time sync
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Coordinate rural healthcare
            <span className="text-primary"> even when offline.</span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            SevaHealth helps frontline workers, PHCs, and coordinators manage
            patients, visits, and alerts in one place—designed for
            low-connectivity regions with offline sync when the network returns.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">Launch dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Create coordinator account</Link>
            </Button>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <div>
              <dt className="font-medium text-foreground">Offline records</dt>
              <dd>Capture visits & alerts without internet.</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Role-based views</dt>
              <dd>Separate dashboards for workers & admins.</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Fast rollout</dt>
              <dd>Deploy to any district in days, not months.</dd>
            </div>
          </dl>
        </div>

        {/* Right: dashboard highlight */}
        <div className="flex-1">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Today&apos;s overview</CardTitle>
              <CardDescription>
                Snapshot of your PHC and field activity in real time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Active patients" value="1,248" trend="+12%" />
                <Stat label="Field workers" value="86" trend="+5" />
                <Stat
                  label="High-risk alerts"
                  value="23"
                  tone="destructive"
                  trend="Attention"
                />
                <Stat label="Visits completed" value="312" trend="Today" />
              </div>

              <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                Offline data from remote villages is automatically queued and
                synced to Supabase when a connection is available. No more lost
                paper records.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}