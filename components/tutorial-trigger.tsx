import { Button } from "./ui/button";
import { LampDeskIcon } from "lucide-react";
import { useTutorial } from "./tutorial-provider";

export function TutorialTrigger() {
  const { openTutorial } = useTutorial();

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={openTutorial}
    >
      <LampDeskIcon size={16} />
      <span>Tutorial</span>
    </Button>
  );
}