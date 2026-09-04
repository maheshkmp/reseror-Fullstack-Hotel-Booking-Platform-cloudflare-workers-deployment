"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  LayoutGridIcon,
  Link,
  Loader2,
  PlusIcon,
  Star,
  StarIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { useAddRestaurantImage } from "../actions/use-add-restaurant-images";
import { useGetRestaurantImages } from "../actions/use-get-restaurant-images";
import { useUpdateRestaurantImage } from "../actions/use-update-restaurant-image";
import React from "react";
import { toast } from "sonner";

export type RestaurantImage = {
  id: string;
  restaurantId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
  createdAt?: string;
  updatedAt?: string | null;
};

export function SortableImage({
  image,
  onImageClick,
}: {
  image: RestaurantImage;
  onImageClick: (image: RestaurantImage) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        className="drag-handle absolute top-1 left-1 bg-black/70 rounded p-1 z-10
                  cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100
                  transition-opacity"
        {...attributes}
        {...listeners}
      >
        <LayoutGridIcon className="size-3 text-white" />
      </div>
      <Image
        className="size-20 rounded-md aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
        width={200}
        height={200}
        src={image.imageUrl}
        alt={image.altText || ""}
        onClick={() => onImageClick(image)}
        draggable={false}
      />
      {image.isThumbnail && (
        <div className="absolute top-1 right-1 bg-yellow-500 p-0.5 rounded-full">
          <StarIcon size={12} className="text-white" />
        </div>
      )}
    </div>
  );
}

const EMPTY_ARRAY: RestaurantImage[] = [];

export function ManageRestaurantImages({
  className,
  restaurantId,
}: {
  className?: string;
  restaurantId: string; // Made required to ensure proper linking
}) {
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<RestaurantImage | null>(
    null
  );
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Get images for the specific restaurant
  const {
    data,
    isPending: loadingImages,
    error: loadingError,
  } = useGetRestaurantImages(restaurantId);

  // Use images from the hook
  const imagesFromServer = data?.restaurantImages || EMPTY_ARRAY;

  // Local state for images to support drag-and-drop reordering
  const [localImages, setLocalImages] = useState<RestaurantImage[]>(imagesFromServer);

  // Sync localImages with imagesFromServer
  React.useEffect(() => {
    if (!hasOrderChanged || imagesFromServer.length !== localImages.length) {
      setLocalImages(imagesFromServer);
    }
  }, [imagesFromServer, hasOrderChanged]);

  const { mutate: addImage, isPending: uploadingImages } =
    useAddRestaurantImage();
  const { mutate: updateImage, isPending: updatingImage } =
    useUpdateRestaurantImage();

  const handleImageClick = React.useCallback((image: RestaurantImage) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  }, []);

  const handleMarkAsThumbnail = React.useCallback(() => {
    if (!selectedImage || !restaurantId) return;
    const currentThumbnail = imagesFromServer.find((img) => img.isThumbnail);
    
    const setThumbnail = () => {
      updateImage(
        {
          ...selectedImage,
          restaurantId: restaurantId,
          isThumbnail: true,
        },
        { onSuccess: () => {
          toast.success("Thumbnail updated");
          setImageDialogOpen(false);
        }}
      );
    };

    if (currentThumbnail && currentThumbnail.id !== selectedImage.id) {
      updateImage(
        {
          ...currentThumbnail,
          restaurantId: restaurantId,
          isThumbnail: false,
        },
        { onSuccess: setThumbnail }
      );
    } else {
      setThumbnail();
    }
  }, [selectedImage, restaurantId, imagesFromServer, updateImage]);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setLocalImages((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = [...items];
                const [movedItem] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, movedItem);
                return newItems;
            }
            return items;
        });
      setHasOrderChanged(true);
    }
  }, []);

  const handleSaveChanges = React.useCallback(() => {
    if (!hasOrderChanged || !restaurantId) return;
    setIsSaving(true);
    
    Promise.all(
      localImages.map((image, index) =>
        updateImage(
          {
            ...image,
            restaurantId: restaurantId,
            displayOrder: index + 1,
          },
          { onSuccess: () => {}, onError: () => {} }
        )
      )
    ).finally(() => {
      setHasOrderChanged(false);
      setIsSaving(false);
      toast.success("Image order saved");
    });
  }, [hasOrderChanged, restaurantId, localImages, updateImage]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput || !restaurantId) return;
    
    addImage({
      restaurantId: restaurantId,
      imageUrl: imageUrlInput,
      altText: "Image added via URL",
      displayOrder: localImages.length + 1,
    }, {
      onSuccess: () => {
        setUrlDialogOpen(false);
        setImageUrlInput("");
        toast.success("Image added from URL");
      }
    });
  };

  if (!restaurantId) {
    return (
      <div className={cn("p-4 border rounded-md bg-gray-50 text-gray-500 text-sm", className)}>
        No restaurant identifier found.
      </div>
    );
  }

  return (
    <>
      {showGallery && (
        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={async (selectedFiles) => {
            selectedFiles.forEach((file, index) => {
              addImage({
                restaurantId: restaurantId,
                imageUrl: file.url,
                altText: file.filename,
                displayOrder: localImages.length + index + 1,
              });
            });
            setShowGallery(false);
          }}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
        />
      )}

      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText || "Restaurant image"}
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
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={handleMarkAsThumbnail}
              disabled={updatingImage || selectedImage?.isThumbnail === true}
              className={cn(
                "flex items-center gap-2",
                selectedImage?.isThumbnail && "bg-yellow-600 hover:bg-yellow-700"
              )}
            >
              {updatingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star className="h-4 w-4" />
              )}
              {selectedImage?.isThumbnail ? "Current Thumbnail" : "Mark as Thumbnail"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className={cn("rounded-xl border border-gray-200 shadow-sm", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Manage Restaurant Images</CardTitle>
          <CardDescription className="text-xs">
            Upload images or paste a URL to manage your restaurant gallery.
            {hasOrderChanged && (
              <span className="text-amber-600 block mt-1 font-medium italic">
                ⓘ Order changed. Save to apply.
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row gap-3 flex-wrap">
            {/* Upload Button */}
            <div
              onClick={() => setShowGallery(true)}
              className="size-20 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center transition-all duration-200 group"
              title="Upload from Media"
            >
              <PlusIcon className="text-gray-400 group-hover:text-primary transition-colors size-8" strokeWidth={1.5} />
              <span className="text-[10px] text-gray-500 mt-1">Upload</span>
            </div>

            {/* URL Button */}
            <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
              <DialogTrigger asChild>
                <div 
                  className="size-20 bg-violet-50/50 hover:bg-violet-100/50 cursor-pointer rounded-lg border-2 border-dashed border-violet-200 flex flex-col items-center justify-center transition-all duration-200 group"
                  title="Add by URL"
                >
                  <Link className="text-violet-400 group-hover:text-violet-600 transition-colors size-6" strokeWidth={1.5} />
                  <span className="text-[10px] text-violet-500 mt-1">Add URL</span>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Image via URL</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUrlSubmit} className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Direct Image Link</label>
                    <Input 
                      placeholder="https://images.unsplash.com/photo..." 
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="button" variant="ghost" onClick={() => setUrlDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={!imageUrlInput || uploadingImages}>
                      {uploadingImages ? "Adding..." : "Add Image"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {loadingImages &&
              Array(3).fill("_").map((_, i) => (
                <Skeleton key={i} className="size-20 rounded-lg" />
              ))}

            {localImages.map((image) => (
              <DndContext
                key={image.id}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localImages.map((item) => item.id)}
                  strategy={rectSortingStrategy}
                >
                    <SortableImage
                      image={image}
                      onImageClick={handleImageClick}
                    />
                </SortableContext>
              </DndContext>
            ))}
          </div>

          {localImages.length > 0 && (
            <p className="text-[10px] text-gray-400 mt-4 italic">
              * Drag images to reorder. The first image is the default thumbnail.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 bg-gray-50/50 p-4 border-t border-gray-100 rounded-b-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalImages(imagesFromServer);
              setHasOrderChanged(false);
            }}
            disabled={!hasOrderChanged || isSaving}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!hasOrderChanged || isSaving}
            onClick={handleSaveChanges}
            className="shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
