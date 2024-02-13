<?php

namespace BoxyBird\Morph;

class AcfBlockMeta
{
    public static function setup(string $block_id): void
    {
        if (!function_exists('acf_get_block_id') || !function_exists('acf_setup_meta')) {
            return;
        }

        $blocks = parse_blocks(get_the_content());

        $acf_blocks = static::filterOutOnlyAcfBlocks($blocks);

        foreach ($acf_blocks as $block) {
            $block_id_to_match = 'block_' . acf_get_block_id($block['attrs'], [
                'postId'   => get_the_ID(),
                'postType' => get_post_type(),
            ]);

            if ($block_id_to_match !== $block_id) {
                continue;
            }

            acf_setup_meta($block['attrs']['data'] ?? [], $block_id, true);
        }
    }

    public static function reset(string $block_id): void
    {
        if (!function_exists('acf_reset_meta')) {
            return;
        }

        acf_reset_meta($block_id);
    }

    protected static function filterOutOnlyAcfBlocks(array $blocks): array
    {
        $result = [];

        foreach ($blocks as $block) {
            if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $result = array_merge($result, $block['innerBlocks'], static::filterOutOnlyAcfBlocks($block['innerBlocks']));
            }
        }

        $result = array_merge($result, $blocks);

        $result = array_filter($result, function ($block) {
            return strpos($block['blockName'], 'acf/') === 0;
        });

        return array_values($result);
    }
}
