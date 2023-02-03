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

        foreach ($blocks as $block) {
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
}
