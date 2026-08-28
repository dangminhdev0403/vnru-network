import { createResource, defineMutation, defineQuery } from "@dangminhdev04032005/query-resource";
import { newsRepository } from "./repository";
import type { NewsArticle, NewsInput } from "./repository";

export const newsResource = createResource<void>()({
  namespace: ["vnru"],
  name: "admin-news",
  scopeKey: () => ["current-context"],
  queries: {
    list: defineQuery({ inputKey: (status: "DRAFT" | "PUBLISHED" | undefined) => [status ?? "ALL"], queryFn: ({ input, signal }) => newsRepository.list(input, signal) }),
    detail: defineQuery({ inputKey: (id: string) => [id], queryFn: ({ input, signal }) => newsRepository.detail(input, signal) }),
  },
  mutations: {
    create: defineMutation<void, NewsInput, NewsArticle>({ mutationFn: ({ variables }) => newsRepository.create(variables) }),
    update: defineMutation<void, { id: string; input: Partial<NewsInput> }, NewsArticle>({ mutationFn: ({ variables }) => newsRepository.update(variables) }),
    upload: defineMutation({ mutationFn: ({ variables }: { variables: File }) => newsRepository.upload(variables) }),
    publish: defineMutation({ mutationFn: ({ variables }: { variables: { id: string; isFeatured: boolean } }) => newsRepository.publish(variables) }),
    unpublish: defineMutation({ mutationFn: ({ variables }: { variables: string }) => newsRepository.unpublish(variables) }),
  },
});
