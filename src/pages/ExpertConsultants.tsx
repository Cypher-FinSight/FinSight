import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";

const videos = [
  {
    id: "91U45K93aE4",
    title: "Financial Planning for Beginners",
    description: "Learn the fundamentals of managing your finances effectively",
  },
  {
    id: "nKfuulWdvNo",
    title: "Smart Investment Strategies",
    description: "Discover proven strategies to grow your wealth over time",
  },
  {
    id: "izlDvEfirpA",
    title: "Managing Personal Finance",
    description: "Master the art of personal financial management",
  },
  {
    id: "L68TSDXKDgQ",
    title: "Budgeting Tips for Success",
    description: "Learn smart financial planning strategies",
  },
  {
    id: "r3teXG_UJxs",
    title: "Wealth Building Fundamentals",
    description: "Learn smart financial planning strategies",
  },
  {
    id: "A9Xq3FGjpZA",
    title: "Financial Freedom Roadmap",
    description: "Learn smart financial planning strategies",
  },
];

const ExpertConsultants = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">FinSight Academy</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Learn from top financial experts through curated video content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, i) => (
          <motion.a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors"
          >
            <div className="relative aspect-video bg-muted">
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Play className="h-6 w-6 text-primary-foreground ml-1" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{video.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default ExpertConsultants;
