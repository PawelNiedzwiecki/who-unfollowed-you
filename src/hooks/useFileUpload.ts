import { useCallback, useEffect, useRef, useState } from "react";
import { parseHtml } from "../utils/parseHtml";
import { parseJson } from "../utils/parseJson";
import { clearData, loadData, saveData } from "../utils/storage";

function isSameFile(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

function readFileAsUsernames(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      resolve(file.name.endsWith(".json") ? parseJson(text) : parseHtml(text));
    };
    reader.readAsText(file);
  });
}

interface UseFileUploadReturn {
  followers: string[] | null;
  following: string[] | null;
  followersFile: File | null;
  followingFile: File | null;
  analysed: boolean;
  duplicateError: boolean;
  canAnalyse: boolean;
  handleFollowersFile: (file: File) => void;
  handleFollowingFile: (file: File) => void;
  handleAnalyse: () => void;
  handleReset: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [followers, setFollowers] = useState<string[] | null>(null);
  const [following, setFollowing] = useState<string[] | null>(null);
  const [followersFile, setFollowersFile] = useState<File | null>(null);
  const [followingFile, setFollowingFile] = useState<File | null>(null);
  const [analysed, setAnalysed] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = loadData();
    if (stored) {
      setFollowers(stored.followers);
      setFollowing(stored.following);
      setAnalysed(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showDuplicateError = useCallback(() => {
    setDuplicateError(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setDuplicateError(false), 4000);
  }, []);

  const handleFollowersFile = useCallback(
    (file: File) => {
      if (followingFile && isSameFile(file, followingFile)) {
        showDuplicateError();
        return;
      }
      setFollowersFile(file);
      readFileAsUsernames(file).then(setFollowers);
    },
    [followingFile, showDuplicateError],
  );

  const handleFollowingFile = useCallback(
    (file: File) => {
      if (followersFile && isSameFile(file, followersFile)) {
        showDuplicateError();
        return;
      }
      setFollowingFile(file);
      readFileAsUsernames(file).then(setFollowing);
    },
    [followersFile, showDuplicateError],
  );

  const handleAnalyse = useCallback(() => {
    if (followers && following) {
      saveData({ followers, following });
      setAnalysed(true);
    }
  }, [followers, following]);

  const handleReset = useCallback(() => {
    clearData();
    setFollowers(null);
    setFollowing(null);
    setFollowersFile(null);
    setFollowingFile(null);
    setAnalysed(false);
    setDuplicateError(false);
  }, []);

  const canAnalyse = followers !== null && following !== null && !analysed;

  return {
    followers,
    following,
    followersFile,
    followingFile,
    analysed,
    duplicateError,
    canAnalyse,
    handleFollowersFile,
    handleFollowingFile,
    handleAnalyse,
    handleReset,
  };
}
