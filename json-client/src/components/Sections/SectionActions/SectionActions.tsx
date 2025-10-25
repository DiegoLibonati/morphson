import { AnchorAction } from "@src/components/Anchors/AnchorAction/AnchorAction";

export const SectionActions = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center justify-center gap-2 w-[75%] h-full">
      <AnchorAction to="/json/load" ariaLabel="Go to Load JSON">
        Load JSON
      </AnchorAction>
      <AnchorAction to="/json/transform" ariaLabel="Go to Transform JSON">
        Transform JSON
      </AnchorAction>
    </section>
  );
};
