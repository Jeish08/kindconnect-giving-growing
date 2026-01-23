import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Raghavan",
    role: "Monthly Donor",
    content: "KindConnect made it so easy to find causes I truly care about. The transparency in tracking my donations gives me peace of mind that my money is making a real difference.",
    avatar: "PR",
    rating: 5,
  },
  {
    name: "Karthik Nair",
    role: "Volunteer",
    content: "I've been volunteering through KindConnect for 6 months now. The platform connected me with amazing organizations that match my skills and schedule perfectly.",
    avatar: "KN",
    rating: 5,
  },
  {
    name: "Lakshmi Venkatesh",
    role: "NGO Director",
    content: "Since joining KindConnect, our donation intake has increased by 300%. The platform provides incredible tools for managing our campaigns and connecting with donors.",
    avatar: "LV",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Voices of Change
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from the donors, volunteers, and organizations who make our community special.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50 flex flex-col"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed flex-1 mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
