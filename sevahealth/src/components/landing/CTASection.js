import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="border-t bg-muted/40 py-14 sm:py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to streamline your community health programs?
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Launch SevaHealth for your PHC or district in days. Start with a
          small pilot—add more workers and villages as you grow, without data
          migration headaches.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">Start with existing account</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Set up a new deployment</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          No credit card required. Works with your existing devices and
          connectivity constraints.
        </p>
      </div>
    </section>
  );
}