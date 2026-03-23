export default function QuickNotes() {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5">
        <h2 className="text-2xl font-semibold">Quick notes</h2>
  
        <textarea
          className="mt-4 w-full min-h-[220px] rounded-2xl border border-stone-200 px-4 py-3"
          defaultValue={`Ideeën:
  - tafelkaartjes printen
  - ijs halen op de dag zelf
  - speakers opladen
  - playlist klaarzetten`}
        />
      </div>
    );
  }