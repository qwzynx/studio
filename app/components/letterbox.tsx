/* Cinematic letterbox bars — this site's take on the main portfolio's fog gradients */
export default function Letterbox() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="h-3 md:h-5 bg-black" />
        <div className="h-16 bg-linear-to-b from-black/90 to-transparent" />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="h-16 bg-linear-to-t from-black/90 to-transparent absolute bottom-3 md:bottom-5 left-0 right-0" />
        <div className="h-3 md:h-5 bg-black absolute bottom-0 left-0 right-0" />
      </div>
    </>
  );
}
