import * as yup from "yup";

export const Gender = {
  empty: "",
  female: "female",
  male: "male",
  other: "other",
} as const;

export const NewsLetter = {
  receive: "receive",
  reject: "reject",
} as const;

// Enumから値のみの配列生成
const GenderValues = Object.values(Gender) as [string, ...string[]];
const NewsLetterValues = Object.values(NewsLetter) as [string, ...string[]];

const NumberIntSchema = (label: string, min: number = 1) =>
  yup
    .string()
    .label(label)
    .required("${label}を入力してください")
    .transform((val) => {
      if (val === "") return val;
      // 全角数字を半角数字に変換
      return val.replace(/[０-９]/g, (s: string) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      );
    })
    .test(
      "is-integer",
      "${label}は整数で入力してください",
      (val) => !val.includes(".") && !val.includes("．")
    )
    .test("is-number", "${label}は数字のみを入力してください", (val) =>
      /^[0-9０-９]+$/.test(val)
    )
    .test(
      "is-positive",
      "${label}は1以上の数値を入力してください",
      (val) => Number(val) >= min
    );

export const FormSchema = yup.object({
  fullName: yup
    .string()
    .label("名前")
    .required("${label}を入力してください")
    .min(2, "${min}文字以上入力してください"),
  age: NumberIntSchema("年齢"),
  emails: yup.object({
    email: yup
      .string()
      .required("メールアドレスを入力してください")
      .email("有効なメールアドレスを入力してください"),
    confirmEmail: yup
      .string()
      .required("確認用メールアドレスを入力してください")
      .email("有効なメールアドレスを入力してください")
      // oneOfでクロスフィールドバリデーションを行うと上記の.requiredと.emailが無視される
      // .oneOf([yup.ref("confirmEmail")], "メールアドレスが一致しません"),
      .test("emails-match", "メールアドレスが一致しません", function (value) {
        return this.parent.email === value;
      }),
  }),
  gender: yup
    .string()
    .label("性別")
    .required("${label}を選択してください")
    .oneOf(GenderValues, "${label}が正しくありません"),
  // .test('テスト名（省略可）', 'エラーメッセージ（省略可）', 'バリデーション条件')
  // 第3引数の'バリデーション条件'がfalseになると第二引数の'エラーメッセージ'を表示
  // .test("not-empty", "${label}を選択してください", (value) => value !== ""),
  newsLetter: yup
    .string()
    .label("お知らせ")
    .required("${label}の受け取り方法を選択してください")
    .oneOf(NewsLetterValues),
  comment: yup
    .string()
    .label("コメント")
    .min(3, "${min}文字以上入力してください")
    .max(10, "${max}文字以内入力してください"),
  agree: yup
    .boolean()
    .label("利用規約")
    .required("${label}に同意する必要があります")
    .oneOf([true], "${label}に同意する必要があります"),
});
