/**
 * 获取客观题答案
 * @param url_slides PPT URL 列表
 * @return {Array} 答案列表
 */
export default function get_answers(url_slides){
    var el_problem = document.getElementById("problem");
    var answer_list = [];
    if (el_problem){
        var el_exercises_info = el_problem.getElementsByClassName("exercises_info");
        for (let i = 0; i < el_exercises_info.length; i++){
            let el_url = el_exercises_info[i].querySelector(".img_box>img");
            let el_ans = el_exercises_info[i].querySelector(".answer_info>.correct_answer");
            var answer_item = { url: el_url ? el_url.src : "", ans: el_ans ? el_ans.innerText : "", index: -1 };
            answer_item.index = url_slides.indexOf(answer_item.url);
            answer_list.push(answer_item);
        }
    }
    console.groupCollapsed(`雨课堂课件PDF下载工具：提取到 ${answer_list.length} 项答案`);
    console.table(answer_list);
    console.groupEnd();
    return answer_list;
}