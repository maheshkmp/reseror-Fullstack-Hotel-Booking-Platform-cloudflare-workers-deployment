"use client";

import { RoomTypeWithRelations } from "core/zod";
import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { LinkIcon, Loader2, PlusIcon, StarIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useAddRoomTypeImages } from "../../../queries/use-add-room-type-images";
import { useGetRoomTypeImages } from "../../../queries/use-get-room-type-images-by-id";

type RoomTypeImage = {
  id: string;
  hotelId: string;
  roomTypeId: string | null;
  imageUrl: string;
  altText: string | null;
  displayOrder: number | null;
  isThumbnail: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

type Props = {
  roomType: RoomTypeWithRelations;
};

export function ManageRoomTypeImages({ roomType }: Props) {
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<RoomTypeImage | null>(
    null
  );
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const { data: imagesData, isPending: loadingImages } = useGetRoomTypeImages(
    roomType.id
  );
  const { mutate: addImages, isPending: uploadingImages } =
    useAddRoomTypeImages(roomType.id);

  const handleImageClick = (image: RoomTypeImage) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const handleAddUrl = useCallback(() => {
    if (urlInput.trim()) {
      addImages([{
        imageUrl: urlInput.trim(),
        altText: "External Link",
        displayOrder: images.length + 1,
        isThumbnail: images.length === 0,
      }]);
      setUrlInput("");
      setShowUrlInput(false);
    }
  }, [urlInput, addImages, imagesData]);

  const images = imagesData?.data || [];

  return (
    <>
      {showGallery && (
        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={async (selectedFiles) => {
            addImages(
              selectedFiles.map((file, index) => ({
                imageUrl: file.url,
                altText: file.filename,
                displayOrder: images.length + index + 1,
                isThumbnail: index === 0 && images.length === 0 ? true : null,
              }))
            );
            setShowGallery(false);
          }}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
        />
      )}

      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Room Type Image Preview</DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full aspect-video">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText || "Room type image"}
                  fill
                  className="object-contain"
                />
                {selectedImage.isThumbnail && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-md flex items-center gap-1">
                    <StarIcon size={16} />
                    <span className="text-xs">Thumbnail</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {selectedImage.altText}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-3">
        <div>
          <h2 className="text-lg font-semibold">Room Type Images</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage images for {roomType.name}.
          </p>
        </div>

        <div className="mt-3 space-y-4">
          {showUrlInput && (
            <div className="flex flex-row gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-1">
              <Input 
                placeholder="https://example.com/image.jpg" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="max-w-md h-10 shadow-none border-slate-300 focus:border-slate-400"
              />
              <Button 
                type="button" 
                variant="default"
                className="h-10 text-xs font-bold px-4 bg-slate-900 text-white rounded-xl shadow-none"
                onClick={handleAddUrl}
              >
                Add
              </Button>
              <Button 
                type="button" 
                variant="ghost"
                className="h-10 w-10 p-0 text-slate-400 hover:text-slate-900"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput("");
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          )}

          <div className="flex flex-row gap-3 flex-wrap">
            <div
              onClick={() => setShowGallery(true)}
              className="size-24 bg-white hover:bg-slate-50 cursor-pointer rounded-xl border-dashed border-2 border-slate-200 flex flex-col items-center justify-center transition-colors"
            >
              {uploadingImages ? (
                <Loader2 className="size-5 text-slate-400 animate-spin" />
              ) : (
                <>
                  <PlusIcon className="text-slate-500 size-5" strokeWidth={2} />
                  <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest leading-none">Upload</span>
                </>
              )}
            </div>

            <div
              onClick={() => setShowUrlInput(true)}
              className="size-24 bg-white hover:bg-slate-50 cursor-pointer rounded-xl border-dashed border-2 border-slate-200 flex flex-col items-center justify-center transition-colors space-y-2"
            >
              <LinkIcon className="text-slate-500 size-4" strokeWidth={2} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none text-center px-1">Add URL</span>
            </div>

            {loadingImages &&
              Array(4)
                .fill("_")
                .map((_, index) => <Skeleton key={index} className="size-24 rounded-xl" />)}

            {images.length > 0 &&
              images.map((image) => (
                <div key={image.id} className="relative size-24 group">
                  <Image
                    className="rounded-xl aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity border border-slate-200"
                    width={200}
                    height={200}
                    src={image.imageUrl}
                    alt={image.altText || ""}
                    onClick={() => handleImageClick(image)}
                  />
                  {image.isThumbnail && (
                    <div className="absolute top-1 right-1 bg-yellow-500 text-white p-1 rounded-full shadow-sm">
                      <StarIcon size={10} />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
