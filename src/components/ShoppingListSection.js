export default function ShoppingListSection({
    handlePrint,
    newItem,
    setNewItem,
    addItem,
    children,
  }) {
    return (
      <div className="print-section bg-white rounded-3xl border border-stone-200 shadow-sm p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Boodschappenlijst</h2>
          <button
            onClick={handlePrint}
            className="text-sm bg-stone-900 text-white px-3 py-1 rounded-lg"
          >
            Print
          </button>
        </div>
  
        <p className="text-stone-500 text-sm mt-1">
          Je kunt alles hieronder ook handmatig aanpassen in de app.
        </p>
  
        <div className="no-print grid md:grid-cols-6 gap-3 mt-5">
          <select
            className="rounded-xl border border-stone-200 px-3 py-2"
            value={newItem.phase}
            onChange={(e) => setNewItem({ ...newItem, phase: e.target.value })}
          >
            <option value="" disabled>Type gang</option>
            <option>Aperitivo</option>
            <option>Antipasti</option>
            <option>Primi Piatti</option>
            <option>Dolci</option>
            <option>Digestivo</option>
            <option>Afterparty</option>
          </select>
  
          <select
            className="rounded-xl border border-stone-200 px-3 py-2"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            <option value="" disabled>Categorie</option>
            <option>Drank</option>
            <option>Eten</option>
          </select>
  
          <input
            className="rounded-xl border border-stone-200 px-3 py-2"
            placeholder="Item"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
  
          <input
            className="rounded-xl border border-stone-200 px-3 py-2"
            type="number"
            placeholder="Aantal"
            value={newItem.qty}
            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
          />
  
          <input
            className="rounded-xl border border-stone-200 px-3 py-2"
            placeholder="Eenheid"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          />
  
          <input
            className="rounded-xl border border-stone-200 px-3 py-2"
            type="number"
            placeholder="Prijs p/st"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
        </div>
  
        <div className="no-print grid md:grid-cols-[1fr_auto] gap-3 mt-3">
          <input
            className="rounded-xl border border-stone-200 px-3 py-2"
            placeholder="Notities"
            value={newItem.notes}
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
          />
          <button
            onClick={addItem}
            className="rounded-xl bg-red-500 text-white px-6 py-2 font-medium hover:opacity-90"
          >
            Toevoegen
          </button>
        </div>
  
        <div className="mt-6 space-y-5">{children}</div>
      </div>
    );
  }