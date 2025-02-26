import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-12 lg:gap-20 py-8 lg:py-24 px-4 md:px-10">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-3xl md:text-5xl lg:text-7xl tracking-tight py-4 leading-tight">
          Find Your Dream Job
          <span className="flex items-center gap-2 md:gap-4">
            and get
            <img
              src="/logo.png"
              className="h-12 md:h-20 lg:h-28"
              alt="Hirrd Logo"
            />
          </span>
        </h1>
        <p className="text-gray-400 mt-3 text-sm md:text-lg">
          Explore thousands of job listings or find the perfect candidate.
        </p>
      </section>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
        <Link to={"/jobs"}>
          <Button variant="blue" size="xl" className="w-full sm:w-auto">
            Find Jobs
          </Button>
        </Link>
        <Link to={"/post-job"}>
          <Button variant="destructive" size="xl" className="w-full sm:w-auto">
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Company Logos Carousel */}
      <Carousel
        plugins={[
          Autoplay({
            delay: 2500,
          }),
        ]}
        className="w-full py-8 md:py-12"
      >
        <CarouselContent className="flex gap-4 sm:gap-12 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 sm:basis-1/5 lg:basis-1/6">
              <img
                src={path}
                alt={name}
                className="h-8 sm:h-12 lg:h-16 object-contain mx-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Banner Image */}
      <img src="/banner.jpeg" className="w-full h-auto rounded-xl shadow-lg" />

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500 text-sm md:text-base">
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500 text-sm md:text-base">
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <Accordion type="multiple" className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`} className="border-b">
            <AccordionTrigger className="text-sm md:text-lg font-semibold">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-500 text-xs md:text-base">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
