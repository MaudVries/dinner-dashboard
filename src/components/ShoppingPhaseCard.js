import ShoppingColumn from "./ShoppingColumn";

export default function ShoppingPhaseCard({
  group,
  editingItemId,
  setEditingItemId,
  updateItem,
  toggleBought,
  removeItem,
}) {
  const total = [...group.drank, ...group.eten].reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  return (
    <div className="border border-stone-200 rounded-2xl p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-xl">{group.phase}</h3>
          <p className="text-sm text-stone-500">Drank links, eten rechts.</p>
        </div>
        <span className="text-sm text-stone-500">€ {total.toFixed(2)}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ShoppingColumn
          title="Drank"
          emptyText="Nog geen drank-items"
          items={group.drank}
          editingItemId={editingItemId}
          setEditingItemId={setEditingItemId}
          updateItem={updateItem}
          toggleBought={toggleBought}
          removeItem={removeItem}
        />

        <ShoppingColumn
          title="Eten"
          emptyText="Nog geen eten-items"
          items={group.eten}
          editingItemId={editingItemId}
          setEditingItemId={setEditingItemId}
          updateItem={updateItem}
          toggleBought={toggleBought}
          removeItem={removeItem}
        />
      </div>
    </div>
  );
}