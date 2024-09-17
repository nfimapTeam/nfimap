import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Input,
  VStack,
  Image,
  Text,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  Button,
  Center,
  Flex,
  Divider,
} from "@chakra-ui/react";
import Loading from "../components/Loading";

interface Image {
  url: string;
}

interface Album {
  id: string;
  name: string;
  release_date: string;
  images: Image[];
  tracks: {
    href: string;
  };
  href: string;
}

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
}

interface SpotifyTokenResponse {
  access_token: string;
}

interface SpotifySearchResponse {
  artists: {
    items: Array<{ id: string }>;
  };
}

interface SpotifyAlbumsResponse {
  items: Album[];
  next: string | null;
}

interface SpotifyTracksResponse {
  items: Track[];
}

const Music: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [token, setToken] = useState<string>("");
  const [artistId, setArtistId] = useState<string>("");
  const [limit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getToken = useCallback(async () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID_API_KEY;
    const clientSecret = process.env.REACT_APP_SPOTIFY_SECRET_ID_API_KEY;
    try {
      const result = await axios.post<SpotifyTokenResponse>(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setToken(result.data.access_token);
    } catch (error) {
      console.error("Failed to get token:", error);
    }
  }, []);

  useEffect(() => {
    getToken();
  }, [getToken]);

  const searchArtist = useCallback(async () => {
    if (token) {
      try {
        const result = await axios.get<SpotifySearchResponse>(
          `https://api.spotify.com/v1/search?q=N.Flying&type=artist`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        if (result.data.artists.items.length > 0) {
          setArtistId(result.data.artists.items[0].id);
          setOffset(0);
          setAlbums([]);
          setHasMore(true);
        }
      } catch (error) {
        console.error("Failed to search artist:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    searchArtist();
  }, [searchArtist]);

  const getAlbums = useCallback(async () => {
    if (artistId && !loading && hasMore) {
      setLoading(true);
      try {
        const result = await axios.get<SpotifyAlbumsResponse>(
          `https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&offset=${offset}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        setAlbums((prevAlbums) => {
          const newAlbums = [...prevAlbums, ...result.data.items];
          const uniqueAlbums = Array.from(
            new Map(newAlbums.map((album) => [album.id, album])).values()
          );
          return uniqueAlbums;
        });
        setHasMore(result.data.next !== null);
        setOffset((prevOffset) => prevOffset + limit);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [token, artistId, limit, offset, loading, hasMore]);

  useEffect(() => {
    if (artistId) {
      getAlbums();
    }
  }, [artistId, getAlbums]);

  const handleAlbumClick = async (album: Album) => {
    console.log("Selected album:", album); // Inspect the album object

    // Check if the album object contains the href for tracks
    if (!album.href) {
      console.error("No tracks URL available for the selected album");
      return;
    }

    setSelectedAlbum(album);
    onOpen(); // Open modal before fetching tracks

    try {
      // Fetch album details to get the tracks URL
      const result = await axios.get<Album>(album.href, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!result.data.tracks || !result.data.tracks.href) {
        console.error("No tracks URL available for the selected album");
        return;
      }

      // Fetch tracks using the tracks URL
      const tracksResult = await axios.get<SpotifyTracksResponse>(
        result.data.tracks.href,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setTracks(tracksResult.data.items);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    }
  };

  const handleLoadMore = () => {
    getAlbums();
  };

  return (
    <Box p="16px 0 100px 0" h="calc(100vh - 120px)" overflow="auto">
      <VStack spacing={4}>
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {albums.map((album) => (
            <Box
              key={album.id}
              onClick={() => handleAlbumClick(album)}
              cursor="pointer"
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Image src={album.images[0]?.url} alt={album.name} />
              <Text mt={2} fontSize="sm" fontWeight="bold">
                {album.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {album.release_date}
              </Text>
            </Box>
          ))}
        </Grid>
        {loading && <Loading />}
        {hasMore && !loading && (
          <Center mt={4}>
            <Button onClick={handleLoadMore}>
              Load More
            </Button>
          </Center>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text
              as="label"
              fontWeight="bold"
              fontSize="2xl"
              color="black.800"
              border="2px"
              borderColor="black.300"
              borderRadius="lg"
              px={4}
              py={2}
              bg="black.50"
              display="inline-block"
            >
              {selectedAlbum?.name}
            </Text>
          <ModalCloseButton border="none" />
          </ModalHeader>
          <ModalBody p={4}>
            {tracks.length === 0 ? (
              <Text textAlign="center" color="gray.500">
                트렉이 없습니다.
              </Text>
            ) : (
              <VStack spacing={4} align="start">
                {tracks.map((track) => (
                  <Box
                    key={track.id}
                    p={3}
                    borderWidth={1}
                    borderRadius="md"
                    boxShadow="sm"
                    bg="gray.50"
                    w="100%"
                  >
                    <Flex align="center" justify="space-between">
                      <Text fontWeight="bold" fontSize="md">
                        {track.name}
                      </Text>
                      {track.preview_url && (
                        <audio controls src={track.preview_url}>
                          오디오를 지원하지 않습니다.
                        </audio>
                      )}
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Music;
