'use client'; 
//클라이언트 쪽에서 렌더링 됨을 명시
import { Button } from "@/components/ui/button";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
function Home() {
  const router = useRouter();

  //page 생성 및 supabase 연동
  const onCreate = async() => {
    const {error, status} = await supabase.from('todos').insert([
      {
        title: "",
        start_date: new Date(),
        end_date: new Date(),
        contents: [],
      },
    ])
    .select();
    
    if(error) {
      console.log(error);
    }

     const {data} = await supabase.from('todos').select();

    if(status === 201) {
       toast("페이지 생성 완료", {
        description: "새로운 투두리스트가 생성되었습니다.",
      });
      if(data) {
      router.push(`/create/${data[data?.length-1].id}`);
    }else return;
    }

  };

  return (
    <div className={styles.container}>
      <div className={styles.container__onBoarding}>
        <span className={styles.container__onBoarding__title}>
          How to Start:{" "}
        </span>
        <div className={styles.container__onBoarding__steps}>
          <span>1. Create a page</span>
          <span>2. Add boards to page</span>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          variant={"outline"}
          className="w-full bg-transparent text-emerald-500 border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
          onClick={onCreate}
        >
          Add new Page
        </Button>
      </div>
    </div>
  );
}

export default Home;
