"use client";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function useDeleteTask() {
    const router = useRouter();
  const deleteTask = async (taskId: number) => {
    try {
      const { status, error } = await supabase
        .from("todos")
        .delete()
        .eq("id", taskId);
      if (status === 204) {
        toast("선택한 TASK가 삭제되었습니다.", {
          description: "새로운 TASK가 생기면 추가해주세요",
        });
        router.push("/");
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
  return {deleteTask};
}

export {useDeleteTask};