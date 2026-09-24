import { Link, useLocation } from 'react-router';
import { BadgeIndianRupee, Mail, MapPin, Phone, Ruler, Truck, UserRound } from 'lucide-react';

const pages = {
  '/about-us': {
    eyebrow: 'Our story',
    title: 'About Siddhi Fashion & Tailoring',
    intro: 'Your neighbourhood destination for fashion and tailoring in Jaipur.',
    body: 'We bring together fabrics and ready-to-wear styles chosen for comfort, versatility, and lasting value. Our team is here to make finding the right product and fit straightforward—from browsing to delivery.',
  },
  '/contact-us': {
    eyebrow: 'We are here to help',
    title: 'Contact Us',
    intro: 'Questions about a product, size, or order? Reach out and our team will help.',
    body: 'Please keep your order number ready when contacting us about an existing purchase. Business hours and verified contact details can be updated here by the store administrator.',
  },
  '/size-guide': {
    eyebrow: 'Find your fit',
    title: 'Size Guide',
    intro: 'Use body measurements—not another brand’s label—to select the most reliable size.',
    body: 'Measure around the fullest part of your chest and hips, and around your natural waist. Keep the tape level and comfortably close to the body. Product-specific sizes shown on each product page take priority.',
  },
  '/shipping-delivery': {
    eyebrow: 'Order information',
    title: 'Shipping & Delivery',
    intro: 'Clear delivery updates from checkout until your order reaches you.',
    body: 'Your available delivery options and final charges are shown before payment. After placing an order, use Track Order with your order details to view its latest status.',
  },
} as const;

export function StoreInformation() {
  const { pathname } = useLocation();
  const page = pages[pathname as keyof typeof pages] ?? pages['/about-us'];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{page.eyebrow}</p>
      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">{page.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/75">{page.intro}</p>
      <div className="mt-10 border-y border-border py-8">
        <p className="max-w-3xl leading-7 text-foreground/70">{page.body}</p>

        {pathname === '/about-us' && (
          <section className="mt-8" aria-labelledby="owner-details-heading">
            <h2 id="owner-details-heading" className="text-xl font-semibold">Owner &amp; business details</h2>
            <dl className="mt-5 grid gap-px overflow-hidden border bg-border sm:grid-cols-2">
              <div className="flex gap-3 bg-background p-5">
                <UserRound className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Owner</dt>
                  <dd className="mt-1 font-medium">Vishesh</dd>
                </div>
              </div>
              <div className="flex gap-3 bg-background p-5">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</dt>
                  <dd className="mt-1"><a href="tel:+918875724342" className="font-medium hover:underline">+91 88757 24342</a></dd>
                </div>
              </div>
              <div className="flex gap-3 bg-background p-5 sm:col-span-2">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Store address</dt>
                  <dd className="mt-1 max-w-2xl leading-6">430, Fashion Street, Lane No. 1, near Hanuman Dhaba Chauraha, Raja Park, Jaipur, Rajasthan 302004</dd>
                </div>
              </div>
              <div className="flex gap-3 bg-background p-5">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</dt>
                  <dd className="mt-1 break-all"><a href="mailto:visheshashwani@icloud.com" className="font-medium hover:underline">visheshashwani@icloud.com</a></dd>
                </div>
              </div>
              <div className="flex gap-3 bg-background p-5">
                <BadgeIndianRupee className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">GST number</dt>
                  <dd className="mt-1 font-medium">08AAYPA5478L1ZW</dd>
                </div>
              </div>
            </dl>
          </section>
        )}

        {pathname === '/contact-us' && (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 border p-4"><Phone className="size-5" /><span className="text-sm">Call the store</span></div>
            <div className="flex items-center gap-3 border p-4"><Mail className="size-5" /><span className="text-sm">Email support</span></div>
            <div className="flex items-center gap-3 border p-4"><MapPin className="size-5" /><span className="text-sm">Visit the store</span></div>
          </div>
        )}

        {pathname === '/size-guide' && (
          <div className="mt-8 flex items-start gap-4 bg-muted/50 p-5"><Ruler className="mt-0.5 size-5 shrink-0" /><p className="text-sm leading-6">If you are between sizes, choose the larger size for a more comfortable fit.</p></div>
        )}

        {pathname === '/shipping-delivery' && (
          <div className="mt-8 flex items-start gap-4 bg-muted/50 p-5"><Truck className="mt-0.5 size-5 shrink-0" /><p className="text-sm leading-6">Delivery timing can vary by destination and product availability.</p></div>
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/?view=all" className="inline-flex min-h-11 items-center bg-primary px-5 text-sm font-semibold text-primary-foreground">Shop all products</Link>
        <Link to="/my-orders" className="inline-flex min-h-11 items-center border px-5 text-sm font-semibold">Track an order</Link>
      </div>
    </main>
  );
}
