export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-4 border-rpg-gold/30 border-t-rpg-gold rounded-full animate-spin"></div>
      <p className="text-xs font-pixel text-rpg-gold mt-4 animate-pulse">Loading Realm...</p>
    </div>
  );
}
