import React from "react";
import { Timeline } from "./ui/timeline";
import { PenLine, BookOpen, Share2, MessageSquareText } from "lucide-react";

export function PublishingTimeline() {
  const data = [
    {
      title: "Step 1",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PenLine className="w-6 h-6 text-[#991b1b] dark:text-[#f87171]" />
            <h4 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Draft Your Masterpiece
            </h4>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Use our distraction-free editor to bring your ideas to life. Whether it's a short story, a poem, or a deep-dive review, our tools are designed to keep you in the flow.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=500&fit=crop"
              alt="Writing desk"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&h=500&fit=crop"
              alt="Notebook and pen"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-xl"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-[#991b1b] dark:text-[#f87171]" />
            <h4 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Curate the Experience
            </h4>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Add beautiful cover art, choose your genre, and set the mood. Our platform ensures your work looks stunning on any device, providing an immersive reading experience.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=500&h=500&fit=crop"
              alt="Artistic cover"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop"
              alt="Books on shelf"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-xl"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-6 h-6 text-[#991b1b] dark:text-[#f87171]" />
            <h4 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Publish & Connect
            </h4>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Hit publish and share your story with a global community of readers. Engage with feedback, build your following, and see your impact grow.
          </p>
          <div className="mb-8 space-y-2">
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <MessageSquareText className="w-4 h-4" /> Real-time reader comments
            </div>
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Share2 className="w-4 h-4" /> One-click social sharing
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=500&fit=crop"
              alt="People connecting"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=500&fit=crop"
              alt="Digital sharing"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-xl"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
