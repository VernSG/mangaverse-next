"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@/components/ui/";
import {
  StarIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  RefreshCcwIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ChapterList from "@/components/manga/ChapterList";
import { Skeleton } from "@/components/ui/skeleton";
import MangaInfo from "@/components/manga/MangaInfo";
import CommentSection from "@/components/manga/CommentSection";
import BookmarkButton from "@/components/manga/BookmarkButton";

export default function MangaDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMangaDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching manga detail for slug: ${slug}`);
      const response = await fetch(`/api/manga/${slug}`);

      if (!response.ok) {
        throw new Error(
          `Terjadi kesalahan saat mengambil data manga (${response.status})`
        );
      }

      const responseData = await response.json();
      console.log("API response:", responseData);

      // Periksa apakah data dalam format yang benar (sesuai dengan kode asli)
      const data = responseData.data || responseData;

      if (!data || !data.title) {
        throw new Error("Data manga tidak valid");
      }

      setManga(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching manga detail:", error);
      setError("Gagal memuat detail manga. Silakan coba lagi nanti.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchMangaDetail();
    }
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {/* <Navbar /> */}
        <div
          className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center"
          style={{ minHeight: "60vh" }}
        >
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Gagal memuat detail manga. Silakan coba lagi nanti.
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/")}
              className="bg-gray-700 hover:bg-gray-600"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
            <Button
              onClick={fetchMangaDetail}
              className="bg-blue-600 hover:bg-blue-500"
            >
              <RefreshCcwIcon className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {/* <Navbar /> */}
        <div
          className="container mx-auto px-4 py-8 flex flex-col items-center justify-center"
          style={{ minHeight: "60vh" }}
        >
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Gagal memuat detail manga. Silakan coba lagi nanti.
          </h1>
          <Button
            onClick={() => router.push("/")}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => router.push("/")}
            className="bg-gray-800 hover:bg-gray-700"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>

          <BookmarkButton mangaSlug={slug} mangaTitle={manga.title} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cover Image & Info */}
          <div className="md:col-span-1">
            <div className="relative rounded-lg overflow-hidden shadow-lg mb-4">
              <Image
                src={manga.thumbnail}
                alt={manga.title}
                width={400}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>

            <Card className="bg-gray-800 border-gray-700 mb-4">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-gray-400">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>Author:</span>
                  </div>
                  <div className="text-white">
                    {manga.meta_info?.author || "Unknown"}
                  </div>

                  <div className="flex items-center text-gray-400">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    <span>Status:</span>
                  </div>
                  <div className="text-white">
                    {manga.meta_info?.status || "Unknown"}
                  </div>

                  <div className="flex items-center text-gray-400">
                    <TagIcon className="h-4 w-4 mr-2" />
                    <span>Type:</span>
                  </div>
                  <div className="text-white">
                    {manga.meta_info?.type || "Manga"}
                  </div>

                  <div className="flex items-center text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Released:</span>
                  </div>
                  <div className="text-white">
                    {manga.meta_info?.released || "Unknown"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 mb-4">
              {manga.genre?.map((genre, index) => (
                <Badge
                  key={index}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Manga Details & Chapters */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2 text-white">
              {manga.title}
            </h1>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-300">
                Synopsis
              </h2>
              <p className="text-gray-400">{manga.synopsis}</p>
            </div>

            <div className="mb-6">
              <ChapterList chapters={manga.chapters || []} mangaSlug={slug} />
            </div>

            {/* <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  <div className="flex items-center justify-between">
                    <span>Chapters</span>
                    <span className="text-sm bg-gray-700 px-2 py-1 rounded-md">
                      {manga.meta_info?.total_chapter ||
                        manga.chapters?.length ||
                        0}{" "}
                      Chapters
                    </span>
                  </div>
                </CardTitle>
              </CardHeader> */}
            {/* <CardContent>
                <ChapterList
                  chapters={manga.chapters || []}
                  mangaSlug={slug}
                  showPagination={true}
                  itemsPerPage={50}
                />
              </CardContent> */}
            {/* </Card> */}
          </div>
        </div>

        <CommentSection mangaSlug={slug} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-40 bg-gray-700 mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cover Image & Info Skeleton */}
          <div className="md:col-span-1">
            <Skeleton className="h-96 w-full bg-gray-700 mb-4" />
            <Skeleton className="h-40 w-full bg-gray-700 mb-4" />
            <div className="flex flex-wrap gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-20 bg-gray-700" />
              ))}
            </div>
          </div>

          {/* Manga Details & Chapters Skeleton */}
          <div className="md:col-span-2">
            <Skeleton className="h-10 w-3/4 bg-gray-700 mb-2" />
            <Skeleton className="h-6 w-40 bg-gray-700 mb-6" />
            <Skeleton className="h-40 w-full bg-gray-700 mb-6" />
            <Skeleton className="h-96 w-full bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
