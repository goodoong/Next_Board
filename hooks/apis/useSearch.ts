"use client";
import { tasksAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { toast } from "sonner";

function useSearch() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const search = async (searchTerm: string) => {
    try {
      const { data, status, error } = await supabase
        .from("todos")
        .select("*")
        .ilike("title", `%${searchTerm}%`);

      if (data && status === 200) {
        setTasks(data); //jotai의 tasksAtom 상태를 업데이트
      }
      if (error) {
        toast("에러 발생", {
          description: `Supabase 오류: ${error.message}`,
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      console.log(error);
      toast("네트워크 오류", {
        description: `서버와 연결할 수 없습니다. 다시 시도해주세요
          ${error}`,
        className: "bg-red-500 text-white border-red-600",
      });
    }
  };
  return search;
}

export { useSearch };
